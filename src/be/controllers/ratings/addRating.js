// controllers/ratings/addRating.js
/**
 * Controller: addRating
 * Layer: View-Model (BE)
 * Purpose: Insert a rating for a donation and notify involved parties.
 */
const { q, send500 } = require("../helpers/utils");
const sendRated = require("../mailer/sendRated");

const addRating = async (req, res) => {
  const { rating, comment, donation_id, user_id } = req.body;
  if (!rating || !donation_id || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const sql = `INSERT INTO ratings (donation_id, rating_level, rating_text, user_id) VALUES (?, ?, ?, ?)`;
    const [r] = await q(sql, [donation_id, rating, comment || null, user_id]);
    try { await sendRated(donation_id, user_id); } catch (e) { console.warn("Rating email not sent:", e.message); }
    res.status(201).json({ message: "Rating added successfully", ratingId: r.insertId });
  } catch (err) {
    return send500(res, "Failed to add rating", err);
  }
};

module.exports = addRating;
