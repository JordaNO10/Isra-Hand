const db = require("../../utils/db");
require("dotenv").config(); // Loads FRONTEND_BASE_URL from .env

const verifyUser = (req, res) => {
  const { token } = req.query;
  console.log("🔑 Received token:", token);

  if (!token) {
    return res.status(400).json({ error: "Missing verification token." });
  }

  const sql = "SELECT * FROM users WHERE verification_token = ?";
  db.query(sql, [token], (error, results) => {
    if (error) {
      console.error("❌ Database error:", error);
      return res.status(500).json({ error: "Database error." });
    }

    console.log("🔍 Token lookup results:", results);

    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const user = results[0];
    const userId = user.user_id;

    const updateSql = `
      UPDATE users
      SET is_verified = TRUE, verification_token = NULL, last_login = NOW()
      WHERE user_id = ?
    `;
    db.query(updateSql, [userId], (updateErr) => {
      if (updateErr) {
        console.error("❌ Failed to update verification status:", updateErr);
        return res.status(500).json({ error: "Failed to verify account." });
      }

      console.log(`✅ User ID ${userId} verified successfully`);

      // ✅ Send user info to frontend for auto-login
      res.status(200).json({
        message: "Email verified successfully",
        userId: user.user_id,
        roleId: user.role_id,
        user_name: user.username,
        full_name: user.full_name,
      });
    });
  });
};

module.exports = verifyUser;
