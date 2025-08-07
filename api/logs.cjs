// ✅ File: api/logs.cjs
const fs3 = require("fs");
const path3 = require("path");

const logsFile = path3.resolve("./data/logs.json");

module.exports = (req, res) => {
  const { password } = req.query;
  if (password !== "Whoamidev1819") return res.status(401).json({ error: "Unauthorized" });

  const logs = JSON.parse(fs3.readFileSync(logsFile, "utf8"));
  res.json(logs.logs || []);
};
