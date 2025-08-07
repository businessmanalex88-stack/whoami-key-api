// File: api/resetKey.js

const fs = require('fs');
const path = require('path');

const keysFile = path.resolve('./data/keys.json');

module.exports = (req, res) => {
  const { key, admin_key } = req.query;
  if (admin_key !== 'Whoamidev1819') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!key) return res.status(400).json({ error: 'Missing key param' });

  const keys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
  const index = keys.findIndex(k => k.key === key);

  if (index === -1) return res.status(404).json({ error: 'Key not found' });

  keys[index].user = null;
  keys[index].timestamp = null;

  fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
  res.json({ success: true, message: 'Key reset successfully' });
};
