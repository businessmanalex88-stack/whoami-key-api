import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { key, action } = req.body;
  const log = {
    key,
    action,
    time: new Date().toISOString()
  };
  await kv.lpush("logs", JSON.stringify(log));
  return res.json({ ok: true });
}
