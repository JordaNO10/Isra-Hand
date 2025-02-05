const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost", // Your database host
  user: "root", // Your database username
  password: "", // Your database password
  database: "israhand", // Your database name
});

connection.connect((error) => {
  if (error) {
    console.error("Database connection failed:", error.stack);
    return;
  }
  console.log("Connected to the database.");
});

module.exports = connection;
