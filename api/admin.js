import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { password } = req.query;
  if (password !== 'Whoamidev1819') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const keyPath = path.resolve('./keys.json');
  let keys = [];

  try {
    keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  } catch {
    keys = [];
  }

  const now = Math.floor(Date.now() / 1000);
  const keysWithDays = keys.map(k => {
    let daysLeft = null;

    if (k.first_used) {
      const usedAt = k.first_used;
      const days = Math.max(0, 7 - Math.floor((now - usedAt) / (60 * 60 * 24)));
      daysLeft = days;
    }

    return {
      key: k.key,
      user: k.user || "-",
      days_left: daysLeft !== null ? daysLeft : "-"
    };
  });

  res.json({ keys: keysWithDays });
}
