const check = (ok: boolean, label: string) => `<li>${ok ? "✅" : "❌"} ${label}</li>`;

export function GET(req: Request) {
  const { origin, host } = new URL(req.url);
  const mcp = `${origin}/api/mcp`;
  const poke = `https://poke.com/integrations/new?${new URLSearchParams({ name: "Claude Code", url: mcp })}`;
  const env = process.env;
  const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>claude-in-flight</title>
<style>body{font:16px/1.5 system-ui;max-width:640px;margin:40px auto;padding:0 16px}code{background:#8882;padding:2px 6px;border-radius:4px;word-break:break-all}</style>
<h1>✈️ claude-in-flight</h1>
<h2>Config</h2><ul>
${check(!!env.ROUTINE_URL, "ROUTINE_URL")}${check(!!env.ROUTINE_TOKEN, "ROUTINE_TOKEN")}${check(!!env.RELAY_KEY, "RELAY_KEY")}
${check(!!(env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL), "Upstash Redis")}${check(!!env.NOTIFY_URL && env.NOTIFY_URL !== "none", "Push results to NOTIFY_URL (optional)")}
</ul>
<h2>1. Let your Claude task report back</h2>
<p>In your Claude task's cloud environment, add a <b>network secret</b>: type <b>Bearer</b>, host <code>${host}</code>, path prefix <code>/api/result</code>, value = your <code>RELAY_KEY</code>.</p>
<h2>2. Connect your messaging agent</h2>
<p>MCP server URL: <code>${mcp}</code><br>API key: your <code>RELAY_KEY</code></p>
<p>Using Poke? <a href="${poke}">Add it in one click</a>, then paste your <code>RELAY_KEY</code>.</p>
<h2>3. Text it</h2><p>“Ask Claude Code to add a hello line to the README in &lt;repo&gt;.”</p>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
