import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const keys = [];
  const iter = await kv.keys("key:*");
  for (const k of iter) {
    const data = await kv.get(k);
    keys.push({ key: k.split(":")[1], ...JSON.parse(data) });
  }
  return res.json(keys);
}
