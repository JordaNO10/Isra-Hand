/**
 * פונקציה זו מטפלת בשחרור נעילת תרומה (Unlock).
 * במידה והמשתמש הוא אדמין – הנעילה מוסרת תמיד.
 * במידה ולא – הנעילה מוסרת רק אם המשתמש הוא זה שנעל את התרומה.
 */

const db = require("../../utils/db");
const { getRoleId, isAdmin, getUserId } = require("../helpers/utils");

const unlockDonation = (req, res) => {
  const { id } = req.params;
  const admin = isAdmin(getRoleId(req));
  const userId = getUserId(req) || 0;

  const sql = admin
    ? `UPDATE donations 
       SET locked_until = NULL, locked_by = NULL 
       WHERE donation_id = ?`
    : `UPDATE donations 
       SET locked_until = NULL, locked_by = NULL 
       WHERE donation_id = ? AND (locked_by = ? OR ? = 1)`;

  const params = admin ? [id] : [id, userId, admin ? 1 : 0];

  db.query(sql, params, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to unlock donation" });
    }
    return res.status(204).end(); // הצלחה ללא תוכן
  });
};

module.exports = unlockDonation;
