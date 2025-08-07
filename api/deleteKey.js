import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key, password } = req.body;
  const ADMIN_PASSWORD = "Whoamidev1819";

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const filePath = path.resolve('./keys.json');

  try {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const index = json.findIndex(k => k.key === key);
    if (index === -1) return res.status(404).json({ error: "Key not found" });

    json.splice(index, 1); // hapus key dari array
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));

    return res.status(200).json({ success: true, message: "Key deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
