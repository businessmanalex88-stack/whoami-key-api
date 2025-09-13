import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.query.password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ ok: false, msg: "Unauthorized" });
  }

  const keys = await kv.lrange("keys_list", 0, -1);
  const data = [];
  for (const k of keys) {
    const keyData = await kv.hgetall(`key:${k}`);
    data.push({ key: k, ...keyData });
  }

  return res.json({ ok: true, keys: data });
}
