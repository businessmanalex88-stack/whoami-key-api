const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  try {
    const keysPath = path.join(process.cwd(), 'data', 'keys.json');
    const logsPath = path.join(process.cwd(), 'data', 'logs.json');

    const keys = JSON.parse(fs.readFileSync(keysPath, 'utf-8'));
    const logs = JSON.parse(fs.readFileSync(logsPath, 'utf-8'));

    const html = `
      <html>
        <head>
          <title>Whoami Admin Panel</title>
          <style>
            body { font-family: Arial; background: #111; color: #eee; padding: 20px; }
            h1 { color: #00ff99; }
            pre { background: #222; padding: 15px; border-radius: 5px; overflow-x: auto; }
            .section { margin-bottom: 40px; }
          </style>
        </head>
        <body>
          <h1>🔐 Whoami Admin Panel</h1>

          <div class="section">
            <h2>📦 Stored Keys</h2>
            <pre>${JSON.stringify(keys, null, 2)}</pre>
          </div>

          <div class="section">
            <h2>📜 Usage Logs</h2>
            <pre>${JSON.stringify(logs, null, 2)}</pre>
          </div>
        </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (err) {
    console.error('Admin UI Error:', err);
    res.status(500).send('Internal Server Error');
  }
};
