import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { authorized, db, TTL, unauthorized, type Task } from "../lib/core.js";

const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });

const handler = (req: Request) => {
  if (!authorized(req)) return unauthorized();
  const reportTo = new URL("/api/result", req.url).href;

  return createMcpHandler((server) => {
    server.registerTool(
      "start_claude_code_task",
      {
        title: "Start Claude Code task",
        description:
          "Hand a coding, research, or web-browsing task to Claude Code running in the cloud. Pass the user's full request verbatim, including repo names. Returns a task_id; Claude reports back when done.",
        inputSchema: z.object({ task: z.string() }),
      },
      async ({ task }) => {
        const id = crypto.randomUUID().slice(0, 8);
        const r = await fetch(process.env.ROUTINE_URL!, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.ROUTINE_TOKEN}`,
            "anthropic-beta": "experimental-cc-routine-2026-04-01",
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: `task_id: ${id}\nreport_to: ${reportTo}\n\n${task}` }),
        });
        if (!r.ok) return text(`Failed to start (${r.status}): ${await r.text()}`);
        await db().set<Task>(`task:${id}`, { status: "running" }, { ex: TTL });
        return text(`Started task ${id}. Claude will report back when done; check anytime with get_task_result.`);
      },
    );
    server.registerTool(
      "get_task_result",
      {
        title: "Get Claude Code task result",
        description: "Check whether a Claude Code task finished and get its summary.",
        inputSchema: z.object({ task_id: z.string() }),
      },
      async ({ task_id }) => {
        const t = await db().get<Task>(`task:${task_id}`);
        return text(!t ? `No task ${task_id}.` : t.summary ?? `Task ${task_id} is still running.`);
      },
    );
  })(req);
};

export { handler as GET, handler as POST };
