// database/db.js

const mysql = require("mysql2/promise"); // ✅ use promise wrapper

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "israhand",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = db;
