const db = require("../../utils/db");

const addRating = (req, res) => {
  const { rating, comment, donation_id, user_id } = req.body;

  if (!rating || !donation_id || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
  INSERT INTO ratings (donation_id, rating_level, rating_text, user_id)
  VALUES (?, ?, ?, ?)`;

  db.query(
    sql,
    [donation_id, rating, comment || "", user_id],
    (error, results) => {
      if (error) {
        console.error("Database error during rating add:", error);
        return res.status(500).json({ error: "Database error" });
      }

      res.status(201).json({
        message: "Rating added successfully",
        ratingId: results.insertId,
      });
    }
  );
};

module.exports = addRating;
