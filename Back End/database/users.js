const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const connection = require("./connection.js"); // Adjust the path as necessary

// POST /signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("Received signup request:", { name, email, role });

  // Validate role by checking against the Roles table
  const checkRoleSql = "SELECT * FROM Roles WHERE role_id = ?";
  connection.query(checkRoleSql, [role], (error, results) => {
    if (error) {
      console.error("Database error while checking role:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    // Check if the user already exists
    const checkUserSql = "SELECT * FROM Users WHERE email = ?";
    connection.query(checkUserSql, [email], (error, results) => {
      if (error) {
        console.error("Database error while checking user:", error);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        console.log("User already exists:", email);
        return res.status(400).json({ error: "User already exists." });
      }

      // Hash password before inserting into the database
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const sql =
          "INSERT INTO Users (username, email, password, role_id) VALUES (?, ?, ?, ?)";
        connection.query(
          sql,
          [name, email, hashedPassword, role],
          (error, results) => {
            if (error) {
              console.error("Database error during user insertion:", error);
              return res.status(500).json({ error: "Database error" });
            }
            console.log("User created successfully with ID:", results.insertId);
            res.status(201).json({
              message: "User created successfully",
              userId: results.insertId,
            });
          }
        );
      });
    });
  });
});

// POST /signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body;

  console.log("Received signin request:", { email });

  const sql = "SELECT * FROM Users WHERE email = ?";
  connection.query(sql, [email], (error, results) => {
    if (error) {
      console.error("Database error during signin:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      console.log("Invalid credentials for:", email);
      return res.status(401).json({ error: "Invalid email or password." });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!isMatch) {
        console.log("Invalid credentials for:", email);
        return res.status(401).json({ error: "Invalid email or password." });
      }

      console.log("Signin successful for user:", email);
      res.status(200).json({
        message: "Signin successful!",
        userId: results[0].id,
      });
    });
  });
});

module.exports = router;
