import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.query.password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ ok: false, msg: "Unauthorized" });
  }

  const logs = await kv.lrange("logs", 0, -1);
  return res.json({ ok: true, logs: logs.map(l => JSON.parse(l)) });
}
