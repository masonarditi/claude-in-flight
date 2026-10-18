# ✈️ claude-in-flight

Text coding tasks to Claude Code from a plane — or anywhere you only have iMessage.

![demo](docs/demo.gif)

In-flight Wi-Fi often lets you message for free but blocks everything else. claude-in-flight connects an iMessage agent (like [Poke](https://poke.com)) to a [Claude Code routine](https://code.claude.com/docs/en/routines) running in Anthropic's cloud, on your own Claude plan. You text a task; Claude works in your repos, opens a PR, and texts you back.

```
you (iMessage) → your agent → relay (this repo, on Vercel) → Claude Code routine (cloud)
       ▲                                                              │
       └───────────── summary + PR link ◀── relay ◀───────────────────┘
```

> Unofficial. Not affiliated with Anthropic or Poke.

## What you need

- A Claude **Pro or Max** plan (routines run on it)
- GitHub repos with the [Claude GitHub App](https://github.com/apps/claude) installed
- A free **Vercel** account
- An iMessage agent that supports **custom MCP servers** (tested with Poke)

## Setup (~10 minutes)

### 1. Create the Claude task

1. Go to [claude.ai/code/routines](https://claude.ai/code/routines) → **New task**.
2. Paste [`routine-prompt.md`](routine-prompt.md) as the instructions and pick your model.
3. **Advanced settings → Repository**: add the repos you want to work on.
4. **Trigger**: switch **Schedule** to **API** and create the task.
5. Open **Edit → API trigger**, copy the **Fire URL**, and click **Generate token** (shown once).

### 2. Deploy the relay

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmasonarditi%2Fclaude-in-flight&project-name=claude-in-flight&repository-name=claude-in-flight&env=ROUTINE_URL%2CROUTINE_TOKEN%2CRELAY_KEY%2CNOTIFY_URL%2CNOTIFY_TOKEN&envDefaults=%7B%22NOTIFY_URL%22%3A%22https%3A%2F%2Fpoke.com%2Fapi%2Fv1%2Finbound%2Fapi-message%22%7D&envDescription=Fire%20URL%20and%20token%20from%20your%20Claude%20task%2C%20a%20random%20RELAY_KEY%2C%20and%20where%20to%20push%20results%20%28Poke%20by%20default%3B%20set%20both%20NOTIFY_%2A%20to%20none%20to%20skip%29.&envLink=https%3A%2F%2Fgithub.com%2Fmasonarditi%2Fclaude-in-flight%232-deploy-the-relay&stores=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22upstash%22%2C%22productSlug%22%3A%22upstash-kv%22%2C%22protocol%22%3A%22storage%22%7D%5D)

| Variable | Value |
| --- | --- |
| `ROUTINE_URL` | The task's Fire URL |
| `ROUTINE_TOKEN` | The task's token |
| `RELAY_KEY` | Any long random string, e.g. `openssl rand -hex 24` |
| `NOTIFY_URL` | Where results get pushed. Prefilled for Poke; `none` to skip |
| `NOTIFY_TOKEN` | Your Poke API key ([Kitchen → API Keys](https://poke.com/kitchen)); `none` to skip |

The button also creates a free Upstash Redis store. When it's done, **open your deployment URL**: it checks your config and shows your exact links for the next two steps.

### 3. Let Claude report back

In the Claude task's **cloud environment → settings → Network secrets → Add secret**:
type **Bearer**, host `<your-project>.vercel.app`, path prefix `/api/result`, value = your `RELAY_KEY`.
Claude never sees the key; Anthropic's proxy attaches it.

### 4. Connect your agent

Add an MCP server with URL `https://<your-project>.vercel.app/api/mcp` and your `RELAY_KEY` as the API key. On Poke, the setup page has a one-click link.

Then text it: *"Ask Claude Code to add a hello line to the README in &lt;repo&gt;."*

## Using it

- **Name the repo** in each text. Every text starts a fresh cloud session.
- **Results** are pushed to `NOTIFY_URL` as `{"message", "task_id"}` with `Bearer NOTIFY_TOKEN`, and are also available for 7 days through the `get_task_result` tool, for agents without an inbound webhook.
- **Web tasks** work out of the box: cloud sessions include WebFetch/WebSearch and headless Chromium. Set the environment's network access to **Full** to reach sites beyond the default allowlist.

## Limits

- One fresh session per task; include any context it needs.
- Can't create GitHub repos. Create one, add it to the task, then text.
- The cloud browser isn't logged into your accounts.
- Routines and their API trigger are a research preview and may change.
- Runs count against your Claude plan; API triggers are capped at 30/hour per routine.

## Security

- `RELAY_KEY` guards both the agent → relay and Claude → relay directions. Rotate it in Vercel (and in your agent and network secret) if it leaks.
- The routine runs **without approval prompts**. Limit what it can reach: repos, connectors, and network access.
- Your messaging agent's provider sees every message and result.
- Your agent may have its own GitHub access (e.g. to merge PRs) separate from Claude's.
- Regenerate the routine token from the task's API trigger if it leaks.

## How it works

| File | Role |
| --- | --- |
| [`api/mcp.ts`](api/mcp.ts) | MCP server: `start_claude_code_task` fires the routine; `get_task_result` reads results |
| [`api/result.ts`](api/result.ts) | Claude posts its summary here; stored in Redis and pushed to `NOTIFY_URL` |
| [`api/setup.ts`](api/setup.ts) | The setup page at your deployment's root |
| [`video/`](video) | The demo video (Remotion) |

## License

[MIT](LICENSE)
