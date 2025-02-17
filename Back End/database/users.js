const express = require("express");
const router = express.Router();
const connection = require("./connection.js"); // Adjust the path as necessary

// GET /users/:id - Get user information by ID
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT users.username, users.full_name, users.email, roles.role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.role_id 
    WHERE users.user_id = ?`;
  connection.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("Database error while fetching user:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(results[0]); // Return the user information
  });
});

// GET /users/email/:email - Get user information by email
router.get("/email/:email", (req, res) => {
  const email = req.params.email;

  const sql = `
    SELECT users.username, users.full_name, users.email, roles.role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.role_id 
    WHERE users.user_id = ?`;
  connection.query(sql, [email], (error, results) => {
    if (error) {
      console.error("Database error while fetching user by email:", error);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(results[0]); // Return the user information
  });
});

module.exports = router;
