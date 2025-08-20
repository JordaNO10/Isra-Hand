/**
 * פונקציה זו מטפלת בביטול בקשת תרומה קיימת.
 * מתבצע עדכון במסד הנתונים שמאפס את requestor_id,
 * ורק אם המשתמש הנוכחי הוא זה שביקש את התרומה.
 */

const db = require("../../utils/db");
const { q, getUserId, send500 } = require("../helpers/utils");

const cancelDonationRequest = async (req, res) => {
  const donationId = req.params.id;
  const userId = getUserId(req);

  // בדיקה שהמשתמש מחובר
  if (!userId) return res.status(401).json({ error: "Login required" });

  try {
    const [result] = await q(
      `UPDATE donations
       SET requestor_id = NULL
       WHERE donation_id = ? AND requestor_id = ?`,
      [donationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No active request to cancel" });
    }

    return res.status(204).end(); // הצלחה ללא תוכן
  } catch (err) {
    return send500(res, "Failed to cancel request", err);
  }
};

module.exports = cancelDonationRequest;
