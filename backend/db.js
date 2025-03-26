const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "database.json");

function readDB() {
  const data = fs.readFileSync(dbPath);
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
