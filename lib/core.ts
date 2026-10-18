import { timingSafeEqual } from "node:crypto";
import { Redis } from "@upstash/redis";

export type Task = { status: "running" | "done"; summary?: string };

export const TTL = 60 * 60 * 24 * 7;

export const db = () => Redis.fromEnv();

export const authorized = (req: Request) => {
  const key = Buffer.from(process.env.RELAY_KEY ?? "");
  const given = Buffer.from(req.headers.get("authorization")?.replace(/^Bearer /, "") ?? "");
  return key.length > 0 && key.length === given.length && timingSafeEqual(key, given);
};

export const unauthorized = () => new Response("unauthorized", { status: 401 });
