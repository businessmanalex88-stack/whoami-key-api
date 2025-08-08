import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { password } = req.query;

  if (password !== 'Whoamidev1819') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const logPath = path.resolve('./data/logs.json');

  try {
    const content = fs.readFileSync(logPath, 'utf8');
    const logs = JSON.parse(content);
    return res.status(200).json({ logs });
  } catch (err) {
    console.error("Gagal baca logs.json:", err);
    return res.status(500).json({ error: 'Failed to read logs.json' });
  }
}
