import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { password, amount } = req.query;
  const ADMIN_KEY = 'Whoamidev1819';

  if (password !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const count = parseInt(amount) || 1;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function generateKey(length = 10) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const keysPath = path.resolve('./data/keys.json');
  let keys = [];

  if (fs.existsSync(keysPath)) {
    keys = JSON.parse(fs.readFileSync(keysPath, 'utf8'));
  }

  const newKeys = [];

  for (let i = 0; i < count; i++) {
    const newKey = {
      key: generateKey(),
      user: null,
      timestamp: null
    };
    keys.push(newKey);
    newKeys.push(newKey.key);
  }

  fs.writeFileSync(keysPath, JSON.stringify(keys, null, 2));

  res.json({
    success: true,
    message: `${count} key(s) generated successfully`,
    keys: newKeys
  });
}
