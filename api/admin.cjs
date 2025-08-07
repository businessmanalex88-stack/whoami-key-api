const fs = require('fs');
const path = require('path');

const logsFile = path.resolve('./data/logs.json');

module.exports = (req, res) => {
  const { adminpass } = req.query;
  if (adminpass !== 'superadmin') return res.status(403).json({ error: 'Unauthorized' });

  const logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
  res.json(logs);
};
