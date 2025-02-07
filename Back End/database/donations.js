const express = require("express");
const router = express.Router();
const db = require("../database/connection.js");

// Get all donations
router.get("/donate", (req, res) => {
  const sql = "SELECT * FROM Donations"; // Make sure the table name is correct
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching donations:", error);
      return res.status(500).json({ error: "Failed to fetch donations" });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
