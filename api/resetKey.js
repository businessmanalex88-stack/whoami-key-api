import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Support __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keysFile = path.resolve(__dirname, '../data/keys.json');

export default function handler(req, res) {
  const { key, password } = req.query;

  if (password !== 'Whoamidev1819') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const keys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
  const entry = keys.find(k => k.key === key);

  if (!entry) {
    return res.status(404).json({ error: 'Key not found' });
  }

  entry.user = null;
  entry.timestamp = null;

  fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
  res.json({ success: true, message: `Key "${key}" has been reset.` });
}
