const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "israhand",
});

db.connect((error) => {
  if (error) {
    console.error("Database connection failed:", error.stack);
    return;
  }
  console.log("Connected to the database.");
});

module.exports = db;
