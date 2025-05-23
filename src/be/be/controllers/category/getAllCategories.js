const db = require("../../utils/db");

const getAllCategories = (req, res) => {
  const sql = "SELECT * FROM categories";

  db.query(sql, (error, results) => {
    if (error) {
      console.error("Database error while fetching categories:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(results);
  });
};

module.exports = getAllCategories;
