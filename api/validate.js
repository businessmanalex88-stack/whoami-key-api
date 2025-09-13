import { kv } from "@vercel/kv";
import crypto from "crypto";

export default async function handler(req, res) {
  const { key, hwid } = req.body;
  if (!key || !hwid) return res.status(400).json({ ok: false, msg: "Missing params" });

  const data = await kv.get(`key:${key}`);
  if (!data) return res.json({ ok: false, msg: "Invalid key" });

  const parsed = JSON.parse(data);
  const hwidHash = crypto.createHash("sha256").update(hwid).digest("hex");

  if (!parsed.used) {
    parsed.used = true;
    parsed.hwid = hwidHash;
    parsed.activatedAt = Date.now();
    parsed.lastUsed = Date.now();
    await kv.set(`key:${key}`, JSON.stringify(parsed));
    return res.json({ ok: true, msg: "Key activated" });
  }

  if (parsed.hwid === hwidHash) {
    parsed.lastUsed = Date.now();
    await kv.set(`key:${key}`, JSON.stringify(parsed));
    return res.json({ ok: true, msg: "Valid" });
  }

  return res.json({ ok: false, msg: "Key bound to another device" });
}
