const fs = require('fs');
const path = require('path');

// Path ke file
const keysFile = path.resolve('./data/keys.json');
const logsFile = path.resolve('./data/logs.json');

module.exports = (req, res) => {
  const { key, user } = req.query;
  if (!key || !user) {
    return res.status(400).json({ error: 'Missing key or user' });
  }

  // Baca file
  const keys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
  const logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));

  const entry = keys.find(k => k.key === key);
  if (!entry) return res.json({ valid: false, error: 'Invalid key' });

  // Developer key tidak memiliki batasan waktu/user
  if (entry.key === 'Whoamidev1819') {
    return res.json({ valid: true, expired: false, developer: true });
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60;

  // Jika belum pernah dipakai, bind ke user
  if (!entry.user) {
    entry.user = user;
    entry.timestamp = now;
  }

  // Cegah pemakaian oleh user lain
  if (entry.user !== user) {
    return res.json({ valid: false, error: 'Key already used by another user' });
  }

  const expired = now - entry.timestamp > expiresIn;

  // Update file keys
  fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));

  // Tambahkan log
  logs.logs.push({ key, user, timestamp: now });
  fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));

  // Kirim respon
  res.json({
    valid: true,
    expired,
    developer: false,
    days_left: Math.max(0, Math.floor((expiresIn - (now - entry.timestamp)) / 86400)),
  });
};
