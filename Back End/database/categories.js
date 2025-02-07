const express = require("express");
const router = express.Router();
const db = require("../database/connection.js");

// Example route to get all categories
router.get("/categories", (req, res) => {
  console.log("Fetching categories...");
  const sql = "SELECT * FROM Categories"; // Adjust this query as needed
  db.query(sql, (error, results) => {
    if (error) {
      console.error("Database error while fetching categories:", error);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Categories fetched successfully:", results);
    res.status(200).json(results);
  });
});

module.exports = router;
