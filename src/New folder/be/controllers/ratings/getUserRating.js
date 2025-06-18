const db = require("../../utils/db");

/**
 * Get average rating for a specific user
 * Route: GET /ratings/user/:userId
 */
const getUserRating = async (req, res) => {
  const userId = req.params.userId;

  const sql = `
  SELECT 
    d.user_id,
    ROUND(AVG(r.rating_level), 2) AS avg_rating,
    COUNT(*) AS total_ratings
  FROM ratings r
  JOIN donations d ON r.donation_id = d.donation_id
  WHERE d.user_id = ?
  GROUP BY d.user_id;
`;

  try {
    const [results] = await db.promise().query(sql, [userId]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No ratings found for this user" });
    }

    res.status(200).json(results[0]);
  } catch (error) {
    console.error("Error fetching user rating:", error);
    res.status(500).json({ error: "Failed to fetch user rating" });
  }
};

module.exports = getUserRating;
