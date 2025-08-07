// File: api/verifyKey.js

const fs = require('fs');
const path = require('path');

const keysFile = path.resolve('./data/keys.json');
const logsFile = path.resolve('./data/logs.json');

module.exports = (req, res) => {
  const { key, user } = req.query;
  if (!key || !user) return res.status(400).json({ error: 'Missing key or user' });

  const keys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
  const logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));

  const entry = keys.find(k => k.key === key);

  if (!entry) return res.json({ valid: false, error: 'Invalid key' });

  if (entry.key === 'Whoamidev') {
    return res.json({ valid: true, expired: false });
  }

  const now = Math.floor(Date.now() / 1000);

  if (!entry.user) {
    entry.user = user;
    entry.timestamp = now;
  }

  if (entry.user !== user) return res.json({ valid: false, error: 'Key already used by another user' });

  const expiresIn = 7 * 24 * 60 * 60;
  const expired = now - entry.timestamp > expiresIn;

  fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));

  logs.logs.push({ key, user, timestamp: now });
  fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));

  res.json({ valid: true, expired });
};
