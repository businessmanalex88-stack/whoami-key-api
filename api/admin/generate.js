import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const newKey = Math.random().toString(36).substring(2, 10).toUpperCase();
  const data = {
    used: false,
    hwid: null,
    createdAt: Date.now(),
    activatedAt: null,
    lastUsed: null
  };

  await kv.set(`key:${newKey}`, JSON.stringify(data));
  return res.json({ ok: true, key: newKey });
}
