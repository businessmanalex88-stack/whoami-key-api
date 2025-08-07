hereimport fs from 'fs';
import path from 'path';

const logsFile = path.resolve('./data/logs.json');
const keysFile = path.resolve('./data/keys.json');

export default function handler(req, res) {
  const { adminpass, resetkey } = req.query;

  res.setHeader('Content-Type', 'text/html');

  const style = `
    <style>
      body { font-family: Arial, sans-serif; background: #121212; color: #eee; padding: 30px; }
      h2, h3 { color: #00f7ff; }
      form { margin-top: 20px; }
      input, button {
        padding: 10px;
        margin-right: 10px;
        background: #1e1e1e;
        border: 1px solid #555;
        color: white;
        border-radius: 5px;
      }
      button { background: #00bcd4; border: none; cursor: pointer; }
      button:hover { background: #0097a7; }
      table {
        margin-top: 20px;
        width: 100%;
        border-collapse: collapse;
      }
      th, td {
        padding: 10px;
        border-bottom: 1px solid #444;
        text-align: left;
      }
      tr:hover { background: #1e1e1e; }
      .success { color: #00ff99; }
      .error { color: #ff5555; }
    </style>
  `;

  if (adminpass !== 'superadmin') {
    return res.end(`
      <!DOCTYPE html><html><head><title>Admin Panel</title>${style}</head><body>
        <h2>🔐 Admin Login</h2>
        <form method="GET">
          <input type="password" name="adminpass" placeholder="Enter Admin Password" required />
          <button type="submit">Login</button>
        </form>
      </body></html>
    `);
  }

  let html = `<!DOCTYPE html><html><head><title>Admin Panel</title>${style}</head><body>
    <h2>✅ Admin Panel</h2>`;

  if (resetkey) {
    const keys = JSON.parse(fs.readFileSync(keysFile, 'utf8'));
    const entry = keys.find(k => k.key === resetkey);
    if (entry) {
      delete entry.user;
      delete entry.timestamp;
      fs.writeFileSync(keysFile, JSON.stringify(keys, null, 2));
      html += `<p class="success">Key <b>${resetkey}</b> has been reset.</p>`;
    } else {
      html += `<p class="error">Key not found: <b>${resetkey}</b></p>`;
    }
  }

  const logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
  html += `<p>Total logs: ${logs.logs.length}</p>
    <table><tr><th>Key</th><th>User</th><th>Timestamp</th></tr>`;
  for (let i = logs.logs.length - 1; i >= 0; i--) {
    const log = logs.logs[i];
    const ts = new Date(log.timestamp * 1000).toLocaleString();
    html += `<tr><td>${log.key}</td><td>${log.user}</td><td>${ts}</td></tr>`;
  }
  html += `</table>`;

  html += `
    <h3>🔁 Reset a Key</h3>
    <form method="GET">
      <input type="hidden" name="adminpass" value="${adminpass}" />
      <input type="text" name="resetkey" placeholder="Enter key to reset" required />
      <button type="submit">Reset Key</button>
    </form>`;

  html += `</body></html>`;
  res.end(html);
}
