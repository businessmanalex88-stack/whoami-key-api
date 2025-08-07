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

  const logFilePath = path.resolve('./logs.json');

  let logs = [];

  try {
    const fileContent = fs.readFileSync(logFilePath, 'utf8');
    logs = JSON.parse(fileContent);
  } catch (err) {
    logs = [];
  }

  logs.push({ key, user, timestamp });

  try {
    fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
    return res.status(200).json({ success: true, message: 'Log saved successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save log' });
  }
}
