import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { key, user, timestamp } = req.body;

  if (!key || !user || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // ==== Update data/keys.json ====
  const keyPath = path.resolve('./data/keys.json');
  let keys = [];

  try {
    const content = fs.readFileSync(keyPath, 'utf8');
    keys = JSON.parse(content);
  } catch {
    keys = [];
  }

  const existingKey = keys.find(k => k.key === key);

  if (existingKey) {
    if (!existingKey.first_used) {
      existingKey.first_used = timestamp;
      existingKey.user = user;
    }
  } else {
    keys.push({ key, user, first_used: timestamp });
  }

  fs.writeFileSync(keyPath, JSON.stringify(keys, null, 2));

  // ==== Tambahkan ke data/logs.json ====
  const logPath = path.resolve('./data/logs.json');
  let logs = [];

  try {
    const logContent = fs.readFileSync(logPath, 'utf8');
    logs = JSON.parse(logContent);
  } catch {
    logs = [];
  }

  logs.push({ key, user, timestamp });

  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

  return res.json({ success: true, message: 'Key usage logged' });
}
