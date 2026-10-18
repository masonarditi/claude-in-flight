# claude-in-flight: agent setup guide

You are setting up claude-in-flight for the user: an MCP relay on their Vercel account that lets their iMessage agent start a Claude Code routine and get results back. Work step by step, tell the user what you're doing, and stop to ask when a step needs them.

**Rules**
- Never print secrets (`RELAY_KEY`, routine token, Poke API key) in chat or commit them. Pipe them straight into `vercel env add`.
- The user does every claude.ai, Poke, and browser click themselves. Give them exact steps and wait.
- Ask before creating anything that could cost money. The Upstash Redis free plan is fine.

## 1. Prerequisites
- Check `node`, `git`, and `npx vercel whoami`. If Vercel isn't logged in, ask the user to run `! npx vercel login`.
- The user needs a Claude Pro or Max plan, and the [Claude GitHub App](https://github.com/apps/claude) on the repos they want Claude to work in.

## 2. Get the code and link Vercel
```
git clone https://github.com/masonarditi/claude-in-flight && cd claude-in-flight
npx vercel link --yes --project claude-in-flight
```
If the link step asks for a scope or team, ask the user which one and rerun with `--scope <team>`.

## 3. Database and relay key
```
npx vercel integration add upstash/upstash-kv --name claude-in-flight -e production --no-env-pull
openssl rand -hex 24 | tr -d '\n' > .relay-key && chmod 600 .relay-key
npx vercel env add RELAY_KEY production < .relay-key
```
If Upstash asks for terms acceptance, give the user the link it prints, wait for them, then rerun the command. `.relay-key` is gitignored.

## 4. The user creates the Claude task
Copy the prompt to their clipboard (`pbcopy < routine-prompt.md` on macOS, or show the file), then have them:
1. Open https://claude.ai/code/routines → **New task**, and paste the prompt as the instructions.
2. Select **Opus** explicitly in the model dropdown, not Default.
3. Under **Advanced settings → Repository**, add their repos.
4. Create a new **cloud environment** with **Network access: Full**.
5. Set **Trigger** to **API**, then create the task.
6. Open **Edit → API trigger**, copy the **Fire URL**, and click **Generate token**.

## 5. Routine URL and token
For each value, ask the user to copy it, then run (macOS):
```
pbpaste | tr -d '\n' | npx vercel env add ROUTINE_URL production
pbpaste | tr -d '\n' | npx vercel env add ROUTINE_TOKEN production
```
On other systems, ask them to run `npx vercel env add <NAME> production` in their own terminal and paste the value there.

## 6. Where results go
Ask which messaging agent they use.
- **Poke:** have them create an API key at https://poke.com/kitchen (API Keys), copy it, then run:
  ```
  printf 'https://poke.com/api/v1/inbound/api-message' | npx vercel env add NOTIFY_URL production
  pbpaste | tr -d '\n' | npx vercel env add NOTIFY_TOKEN production
  ```
- **Any other agent:** ask for its inbound webhook URL and token if it has one. If not, set both `NOTIFY_URL` and `NOTIFY_TOKEN` to `none`; results are still available through the `get_task_result` tool.

## 7. Deploy and check
```
npx vercel deploy --prod --yes
```
Open `https://<project>.vercel.app/` and confirm every required line shows ✅. For example, run `curl -s https://<project>.vercel.app/ | grep -oE '(✅|❌) [A-Za-z_ ]+'`.

## 8. The user finishes the wiring
1. **Network secret:** in the Claude task's cloud environment → **Network secrets → Add secret**: type **Bearer**, host `<project>.vercel.app`, path prefix `/api/result`, value = the relay key. Copy it with `pbcopy < .relay-key`.
2. **Messaging agent:** add an MCP server with URL `https://<project>.vercel.app/api/mcp` and the relay key as the API key. On Poke, use the one-click link on the setup page.

## 9. Test
Send a test task through the relay, then poll for the result. The key is read from the file, so it never appears in chat:
```
K=$(cat .relay-key); U=https://<project>.vercel.app/api/mcp
H=(-H 'content-type: application/json' -H 'accept: application/json, text/event-stream' -H "authorization: Bearer $K")
curl -s -X POST $U "${H[@]}" -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"start_claude_code_task","arguments":{"task":"Reply with: claude-in-flight works"}}}'
curl -s -X POST $U "${H[@]}" -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"get_task_result","arguments":{"task_id":"<id from above>"}}}'
```
Poll `get_task_result` every 20 seconds for up to 5 minutes. When the summary comes back (and, with Poke, the user gets a text), tell the user it's ready: they can text their agent "Ask Claude Code to …" and name a repo.
