import { authorized, db, TTL, unauthorized, type Task } from "../lib/core.js";

export async function POST(req: Request) {
  if (!authorized(req)) return unauthorized();
  const { task_id, summary } = await req.json().catch(() => ({}));
  if (typeof task_id !== "string" || typeof summary !== "string") return new Response("task_id and summary required", { status: 400 });

  const redis = db();
  if (!(await redis.exists(`task:${task_id}`))) return new Response("unknown task_id", { status: 404 });
  await redis.set<Task>(`task:${task_id}`, { status: "done", summary }, { ex: TTL });

  if (process.env.NOTIFY_URL && process.env.NOTIFY_URL !== "none") {
    await fetch(process.env.NOTIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NOTIFY_TOKEN && process.env.NOTIFY_TOKEN !== "none" && { Authorization: `Bearer ${process.env.NOTIFY_TOKEN}` }),
      },
      body: JSON.stringify({ message: summary, task_id }),
    });
  }
  return Response.json({ ok: true });
}
