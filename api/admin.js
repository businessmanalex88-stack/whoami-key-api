import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Support __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keysFile = path.resolve(__dirname, '../data/keys.json');

export default function handler(req, res) {
  const { password } = req.query;

  if (password !== 'Whoamidev1819') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  try {
    const keys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
    res.status(200).json({ success: true, keys });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read keys file', details: err.message });
  }
}
