import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.query.password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ ok: false, msg: "Unauthorized" });
  }

  // generate key unik
  const newKey = Math.random().toString(36).substring(2, 10).toUpperCase();

  // simpan ke database
  await kv.hset(`key:${newKey}`, {
    active: true,
    createdAt: Date.now(),
    used: false
  });
  await kv.lpush("keys_list", newKey);

  return res.json({ ok: true, key: newKey });
}
