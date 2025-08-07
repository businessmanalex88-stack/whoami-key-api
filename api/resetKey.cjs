const fs = require('fs');
const path = require('path');

const keysFile = path.resolve('./data/keys.json');

module.exports = (req, res) => {
  const { key, adminpass } = req.query;
  if (adminpass !== 'superadmin') return res.status(403).json({ error: 'Unauthorized' });

  const keys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
  const entry = keys.find(k => k.key === key);
  if (!entry) return res.status(404).json({ error: 'Key not found' });

  delete entry.user;
  delete entry.timestamp;

  fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
  res.json({ success: true, message: 'Key has been reset' });
};
