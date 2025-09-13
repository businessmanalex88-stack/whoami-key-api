import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, msg: "Method not allowed" });
  }

  const log = req.body;
  await kv.lpush("logs", JSON.stringify({ ...log, at: Date.now() }));
  return res.json({ ok: true });
}
