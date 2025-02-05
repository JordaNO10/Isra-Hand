// donations.js
const express = require("express");
const router = express.Router();
const connection = require("./connection.js");

// Route for adding donations (placeholder)
router.post("/donate", (req, res) => {
  const { fullName, amount } = req.body; // Add relevant fields as necessary

  const sql = `INSERT INTO Donations (full_name, amount) VALUES (?, ?)`;
  connection.query(sql, [fullName, amount], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Donation recorded successfully!" });
  });
});

// Additional donation routes can be added here

module.exports = router; // Export the router
