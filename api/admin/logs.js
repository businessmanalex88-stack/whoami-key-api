import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const { password } = req.query;
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const logs = await kv.lrange("logs", 0, 100);
  return res.json(logs.map(l => JSON.parse(l)));
}
