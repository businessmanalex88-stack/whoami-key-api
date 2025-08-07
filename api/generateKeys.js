export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const { password, amount } = req.body;

  // Ganti dengan password admin milikmu
  const ADMIN_PASSWORD = "Whoamidev1819";

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized access." });
  }

  const count = Math.min(Math.max(parseInt(amount), 1), 20); // Batasi antara 1 - 20

  const keys = Array.from({ length: count }, () => generateKey());

  return res.status(200).json({ keys });
}

// Fungsi untuk generate key acak
function generateKey() {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 20; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}
