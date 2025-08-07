<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhoAmI Admin Panel</title>
  <link rel="stylesheet" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
  <style>
    body {
      background-color: #0b0b0b;
      font-family: 'Segoe UI', sans-serif;
      color: white;
      padding: 20px;
    }
    .neon-title {
      font-size: 26px;
      font-weight: bold;
      color: #f00;
      text-shadow: 0 0 6px #f00, 0 0 10px #f00;
      margin-bottom: 30px;
    }
    .section {
      margin-top: 30px;
    }
    .button {
      padding: 10px 20px;
      background-color: #111;
      border: 1px solid red;
      color: white;
      cursor: pointer;
      margin: 5px;
    }
    table.dataTable {
      color: white !important;
      background-color: #111;
    }
    .dataTables_wrapper .dataTables_filter input {
      background: #111;
      color: white;
      border: 1px solid #f00;
    }
  </style>
</head>
<body>
  <div class="neon-title">WhoAmI Admin Panel</div>

  <div class="section">
    <h3>🔑 Generate Key</h3>
    <button class="button" onclick="generateKey()">+ Generate Random Key</button>
    <div id="generatedKeys" style="margin-top: 10px;"></div>
  </div>

  <div class="section">
    <h3>📜 Riwayat Penggunaan (Logs)</h3>
    <table id="logTable" class="display" style="width:100%">
      <thead>
        <tr>
          <th>Waktu</th>
          <th>Aksi</th>
          <th>Key</th>
          <th>Pengguna</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

  <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
  <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
  <script>
    function formatDate(unix) {
      const date = new Date(unix * 1000);
      return date.toLocaleString();
    }

    function generateKey() {
      fetch('/api/generateKeys', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          const container = document.getElementById('generatedKeys');
          if (data.keys && data.keys.length > 0) {
            const html = '<strong>Key baru:</strong><br>' + data.keys.map(k => `<code>${k}</code>`).join('<br>');
            container.innerHTML = html;
          } else {
            container.innerHTML = '<span style="color:red;">Gagal membuat key.</span>';
          }
        })
        .catch(err => {
          document.getElementById('generatedKeys').innerHTML = 'Terjadi kesalahan: ' + err;
        });
    }

    function loadLogTable() {
      fetch('/data/logs.json')
        .then(res => res.json())
        .then(data => {
          const table = $('#logTable').DataTable();
          table.clear();
          const logs = (data.logs || []).sort((a, b) => b.timestamp - a.timestamp);
          logs.forEach(log => {
            const row = [
              formatDate(log.timestamp),
              log.action.toUpperCase(),
              log.key || '-',
              log.user || log.by || '-'
            ];
            table.row.add(row);
          });
          table.draw();
        });
    }

    $(document).ready(function() {
      $('#logTable').DataTable({
        paging: true,
        searching: true,
        ordering: true,
        order: [[0, 'desc']]
      });
      loadLogTable();
    });
  </script>
</body>
</html>
