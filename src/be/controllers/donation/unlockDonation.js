const db = require("../../utils/db");
const { getRoleId, isAdmin, getUserId } = require("../helpers/utils");

/**
 * שחרור נעילת תרומה
 * תפקיד: מחיקת נעילת צפייה על תרומה (Idempotent).
 * שינוי: נרמול role_id ושימוש ב-isAdmin לביטול מגבלות לאדמין.
 */
const unlockDonation = (req, res) => {
  const { id } = req.params;
  const admin = isAdmin(getRoleId(req));
  const userId = getUserId(req) || 0;

  const sql = admin
    ? `UPDATE donations SET locked_until = NULL, locked_by = NULL WHERE donation_id = ?`
    : `UPDATE donations SET locked_until = NULL, locked_by = NULL WHERE donation_id = ? AND (locked_by = ? OR ? = 1)`;

  const params = admin ? [id] : [id, userId, admin ? 1 : 0];

  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: "Failed to unlock donation" });
    return res.status(204).end();
  });
};

module.exports = unlockDonation;
