// POST /signin
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const connection = require("./connection.js"); // Adjust the path as necessary

router.post("/", (req, res) => {
  const { emailOrUsername, password } = req.body; // Accept both email and username

  console.log("Received signin request:", { emailOrUsername });

  const sql = "SELECT * FROM users WHERE email = ? OR username = ?";
  connection.query(
    sql,
    [emailOrUsername, emailOrUsername],
    (error, results) => {
      if (error) {
        console.error("Database error during signin:", error);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length === 0) {
        console.log("Invalid credentials for:", emailOrUsername);
        return res
          .status(401)
          .json({ error: "Invalid email/username or password." });
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
          userId: results[0].user_id, // Correctly reference user_id here
        });
      });
    }
  );
});

module.exports = router;
