// ✅ File: api/resetKey.cjs
const fs2 = require("fs");
const path2 = require("path");

const keysPath = path2.resolve("./data/keys.json");

module.exports = (req, res) => {
  const { key, password } = req.query;
  if (password !== "Whoamidev1819") return res.status(401).json({ success: false, error: "Unauthorized" });

  const keys = JSON.parse(fs2.readFileSync(keysPath, "utf8"));
  const index = keys.findIndex(k => k.key === key);
  if (index === -1) return res.json({ success: false, error: "Key not found" });

  delete keys[index].user;
  delete keys[index].timestamp;

  fs2.writeFileSync(keysPath, JSON.stringify(keys, null, 2));
  res.json({ success: true });
};
