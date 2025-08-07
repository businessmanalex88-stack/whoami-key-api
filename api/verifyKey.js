const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../keys.json');
const DURATION = 7 * 24 * 60 * 60 * 1000; // 7 hari dalam ms

module.exports = async (req, res) => {
  const { key, user } = req.query;
  if (!key || !user) return res.status(400).json({ valid: false, error: 'Missing key or user' });

  let keys = {};
  try {
    keys = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return res.status(500).json({ valid: false, error: 'Key store error' });
  }
  if (!keys[key]) return res.json({ valid: false, error: 'Key not found' });
  if (key === "Whoamidev") return res.json({ valid: true, expired: false, developer: true, days_left: "unlimited" });

  const now = Date.now();
  const info = keys[key];

  if (!info.bound_to) {
    keys[key].bound_to = user;
    keys[key].activated = now;
    fs.writeFileSync(FILE, JSON.stringify(keys, null, 2));
    return res.json({ valid: true, expired: false, developer: false, days_left: 7 });
  }

  if (info.bound_to !== user) {
    return res.json({ valid: false, error: 'Key already used by another user' });
  }

  const elapsed = now - info.activated;
  if (elapsed > DURATION) {
    return res.json({ valid: true, expired: true, developer: false, days_left: 0 });
  }

  const daysLeft = Math.floor((DURATION - elapsed) / (1000 * 60 * 60 * 24));
  return res.json({ valid: true, expired: false, developer: false, days_left: daysLeft });
};
