/**
 * קובץ זה אחראי על אימות משתמשים באמצעות טוקן אימות:
 * - בדיקת תקינות הטוקן שהוזן
 * - עדכון המשתמש כמאומת במסד הנתונים
 * - איפוס הטוקן ושמירת זמן התחברות אחרון
 * - החזרת פרטי המשתמש ל-Frontend (מאפשר התחברות אוטומטית)
 */

const db = require("../../utils/db");
require("dotenv").config(); // טוען משתני סביבה (למשל FRONTEND_BASE_URL)

/**
 * בקר אימות משתמש
 * @param {Object} req - בקשת HTTP (כוללת query עם טוקן אימות)
 * @param {Object} res - תגובת HTTP עם תוצאה או שגיאה
 */
const verifyUser = (req, res) => {
  const { token } = req.query;
  console.log("🔑 התקבל טוקן:", token);

  // בדיקה אם הועבר טוקן
  if (!token) {
    return res.status(400).json({ error: "חסר טוקן אימות." });
  }

  const sql = "SELECT * FROM users WHERE verification_token = ?";
  db.query(sql, [token], (error, results) => {
    if (error) {
      console.error("❌ שגיאת מסד נתונים:", error);
      return res.status(500).json({ error: "שגיאת מסד נתונים." });
    }

    console.log("🔍 תוצאות חיפוש טוקן:", results);

    // אם לא נמצא משתמש עם הטוקן
    if (results.length === 0) {
      return res.status(400).json({ error: "טוקן לא תקף או שפג תוקפו." });
    }

    const user = results[0];
    const userId = user.user_id;

    // עדכון המשתמש כמאומת
    const updateSql = `
      UPDATE users
      SET is_verified = TRUE, verification_token = NULL, last_login = NOW()
      WHERE user_id = ?
    `;
    db.query(updateSql, [userId], (updateErr) => {
      if (updateErr) {
        console.error("❌ כשלון בעדכון סטטוס אימות:", updateErr);
        return res.status(500).json({ error: "נכשל אימות החשבון." });
      }

      console.log(`✅ משתמש עם מזהה ${userId} אומת בהצלחה`);

      // החזרת מידע ל-Frontend (מאפשר התחברות אוטומטית)
      res.status(200).json({
        message: "האימייל אומת בהצלחה",
        userId: user.user_id,
        roleId: user.role_id,
        user_name: user.username,
        full_name: user.full_name,
      });
    });
  });
};

module.exports = verifyUser;
