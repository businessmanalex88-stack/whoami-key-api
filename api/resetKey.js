import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keysFile = path.join(__dirname, "../data/keys.json");

const ADMIN_PASSWORD = "Whoamidev1819";

export default function handler(req, res) {
  const { key, password } = req.query;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const keys = JSON.parse(fs.readFileSync(keysFile, "utf8"));
  const entry = keys.find(k => k.key === key);

  if (!entry) return res.status(404).json({ error: "Key not found" });

  delete entry.user;
  delete entry.timestamp;

  fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
  res.json({ success: true, message: `Key ${key} has been reset.` });
}
