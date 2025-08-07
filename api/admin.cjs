// ✅ File: api/admin.cjs
const fs = require("fs");
const path = require("path");

const keysFile = path.resolve("./data/keys.json");

module.exports = (req, res) => {
  const { password } = req.query;
  if (password !== "Whoamidev1819") return res.status(401).json({ error: "Unauthorized" });

  const keys = JSON.parse(fs.readFileSync(keysFile, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60;

  const formattedKeys = keys.map(k => ({
    ...k,
    daysLeft: k.timestamp ? Math.max(0, Math.floor((expiresIn - (now - k.timestamp)) / 86400)) : null
  }));

  res.json(formattedKeys);
};
