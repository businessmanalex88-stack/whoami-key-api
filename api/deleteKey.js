import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key, password } = req.body;

  const ADMIN_PASSWORD = "Whoamidev1819"; // Ganti sesuai punyamu

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const filePath = path.join(process.cwd(), 'keys.json');

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "keys.json not found" });
    }

    const jsonData = fs.readFileSync(filePath, 'utf-8');
    let keys = [];

    try {
      keys = JSON.parse(jsonData);
      if (!Array.isArray(keys)) throw new Error("Invalid keys format");
    } catch (parseErr) {
      return res.status(500).json({ error: "Failed to parse keys.json" });
    }

    const index = keys.findIndex(k => k.key === key);
    if (index === -1) {
      return res.status(404).json({ error: "Key not found" });
    }

    keys.splice(index, 1); // remove key
    fs.writeFileSync(filePath, JSON.stringify(keys, null, 2));

    return res.status(200).json({ success: true, message: "Key deleted successfully" });

  } catch (err) {
    console.error("Delete Key Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
