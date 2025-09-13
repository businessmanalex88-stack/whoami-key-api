import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, msg: "Method not allowed" });
  }

  const { key, userId } = req.body;

  if (!key) return res.status(400).json({ ok: false, msg: "Key required" });

  const data = await kv.hgetall(`key:${key}`);
  if (!data || !data.active) {
    return res.status(403).json({ ok: false, msg: "Invalid key" });
  }

  // kalau key pertama kali dipakai → tandai used
  if (!data.used) {
    await kv.hset(`key:${key}`, { used: true, userId, activatedAt: Date.now() });
    return res.json({ ok: true, msg: "Key activated" });
  }

  // kalau sudah pernah dipakai → hanya user yg sama yg bisa pakai lagi
  if (data.userId && data.userId != userId) {
    return res.status(403).json({ ok: false, msg: "Key already bound to another user" });
  }

  return res.json({ ok: true, msg: "Key valid" });
}
