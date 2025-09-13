export default function handler(req, res) {
  const { password } = req.query;

  if (password !== process.env.WarpahVVIP) {
    return res.status(403).json({ ok: false, msg: "Unauthorized" });
  }

  const newKey = Math.random().toString(36).substring(2, 12);
  return res.status(200).json({ ok: true, key: newKey });
}
