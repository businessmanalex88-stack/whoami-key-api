import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsFile = path.join(__dirname, "../data/logs.json");

const ADMIN_PASSWORD = "Whoamidev1819";

export default function handler(req, res) {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const logs = JSON.parse(fs.readFileSync(logsFile, "utf8"));
  res.json(logs);
}
