// File: api/admin.js

module.exports = (req, res) => {
  const { admin_key } = req.query;
  if (admin_key !== 'Whoamidev1819') {
    return res.status(401).send('Unauthorized');
  }

  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <html>
    <head><title>Admin Panel</title></head>
    <body style="font-family: sans-serif; padding: 20px;">
      <h1>🔐 WhoAmI Admin Panel</h1>
      <p><a href="/api/getLogs?admin_key=Whoamidev1819">📋 View Logs</a></p>
      <p><a href="/api/addKey?admin_key=Whoamidev1819&key=NEWKEY123">➕ Add Key</a></p>
      <p><a href="/api/resetKey?admin_key=Whoamidev1819&key=EXISTINGKEY">🔄 Reset Key</a></p>
      <p><a href="/api/deleteKey?admin_key=Whoamidev1819&key=EXISTINGKEY">🗑️ Delete Key</a></p>
    </body>
    </html>
  `);
};
