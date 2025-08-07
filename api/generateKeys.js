const fs = require('fs');
const path = require('path');

const keysPath = path.resolve('./data/keys.json');

// Fungsi untuk membuat 1 key acak (10 karakter huruf kapital + angka)
function generateKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 10; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

module.exports = (req, res) => {
  const { amount, password } = req.query;

  // Validasi password admin
  if (password !== 'Whoamidev1819') {
    return res.status(403).json({ success: false, error: 'Invalid admin password' });
  }

  const total = parseInt(amount);
  if (isNaN(total) || total <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid amount' });
  }

  try {
    const existing = JSON.parse(fs.readFileSync(keysPath, 'utf8'));

    const newKeys = [];
    for (let i = 0; i < total; i++) {
      const key = generateKey();
      newKeys.push({ key, user: null, timestamp: null });
    }

    const allKeys = existing.concat(newKeys);
    fs.writeFileSync(keysPath, JSON.stringify(allKeys, null, 2));

    res.json({
      success: true,
      message: `${newKeys.length} key(s) generated`,
      keys: newKeys.map(k => k.key),
    });
  } catch (err) {
    console.error('Error generating keys:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
