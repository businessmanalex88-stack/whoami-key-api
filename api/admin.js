import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keysFile = path.join(__dirname, "../data/keys.json");

const ADMIN_PASSWORD = "Whoamidev1819";

export default function handler(req, res) {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const keys = JSON.parse(fs.readFileSync(keysFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60;

  const data = keys.map(k => {
    const used = !!k.user;
    const days_left = used
      ? Math.max(0, Math.floor((expiresIn - (now - (k.timestamp || 0))) / 86400))
      : null;

    return {
      key: k.key,
      user: k.user || null,
      days_left,
    };
  });

  res.json({ keys: data });
}
