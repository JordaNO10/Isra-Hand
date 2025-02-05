const express = require("express");
const router = express.Router();
const connection = require("./connection.js"); // Adjust the path as necessary

// POST /signup
router.post("/signup", (req, res) => {
  const { name, email, password, role } = req.body; // Get data from request body, including role
  console.log("Received signup request:", { name, email, role }); // Log received data

  // Check if the user already exists
  const checkUserSql = "SELECT * FROM Users WHERE email = ?";
  connection.query(checkUserSql, [email], (error, results) => {
    if (error) {
      console.error("Database error while checking user:", error); // Log the error
      return res.status(500).json({ error: "Database error" });
    }

    // If user exists, return an error
    if (results.length > 0) {
      console.log("User already exists:", email); // Log existing user
      return res.status(400).json({ error: "User already exists." });
    }

    // Proceed to insert new user with role
    const sql =
      "INSERT INTO Users (username, email, password, role_id) VALUES (?, ?, ?, ?)";
    connection.query(sql, [name, email, password, role], (error, results) => {
      if (error) {
        console.error("Database error during user insertion:", error); // Log the error for debugging
        return res.status(500).json({ error: "Database error" });
      }
      console.log("User created successfully with ID:", results.insertId); // Log successful creation
      res.status(201).json({
        message: "User created successfully",
        userId: results.insertId,
      });
    });
  });
});
// POST /signin
router.post("/signin", (req, res) => {
  const { email, password } = req.body; // Get data from request body
  console.log("Received signin request:", { email }); // Log received data

  // Check if the user exists
  const sql = "SELECT * FROM Users WHERE email = ? AND password = ?";
  connection.query(sql, [email, password], (error, results) => {
    if (error) {
      console.error("Database error during signin:", error); // Log the error
      return res.status(500).json({ error: "Database error" });
    }

    // If user doesn't exist, return an error
    if (results.length === 0) {
      console.log("Invalid credentials for:", email); // Log invalid credentials
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("Signin successful for user:", email); // Log successful signin
    res.status(200).json({
      message: "Signin successful!",
      userId: results[0].id, // Assuming user ID is in the results
    });
  });
});

module.exports = router;
