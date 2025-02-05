const express = require("express");
const router = express.Router();
const db = require("../database/connection.js");

// Route to handle user signup
router.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate input
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if email already exists
  const checkEmailSql = "SELECT * FROM Users WHERE email = ?";
  db.query(checkEmailSql, [email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const sql =
      "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, password, role], (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({
        message: "User created successfully",
        userId: results.insertId,
      });
    });
  });
});

// Route to handle user signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const sql = "SELECT * FROM Users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.status(200).json({ message: "Signin successful", user: results[0] });
  });
});

module.exports = router;
