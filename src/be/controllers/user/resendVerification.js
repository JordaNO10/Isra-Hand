/**
 * קובץ זה אחראי על שליחה מחדש של מייל אימות למשתמש:
 * - בדיקה אם המשתמש קיים ולא מאומת
 * - יצירת טוקן אימות חדש ושמירתו במסד הנתונים
 * - שליחת מייל אימות עם קישור חדש
 */

const crypto = require("crypto");
const db = require("../../utils/db");
const { sendMail } = require("../../utils/mailer");
require("dotenv").config();
const { emailVerificationTemplate } = require("../../templates/emailTemplates");

/**
 * בקר לשליחת מייל אימות מחדש
 * @param {Object} req - בקשת HTTP עם אימייל או שם משתמש
 * @param {Object} res - תגובת HTTP עם תוצאה או שגיאה
 */
const resendVerification = (req, res) => {
  const { emailOrUsername } = req.body;

  // בדיקה שהוזן אימייל או שם משתמש
  if (!emailOrUsername) {
    return res.status(400).json({ error: "חובה לספק אימייל או שם משתמש" });
  }

  const selectSql = `
    SELECT * FROM users 
    WHERE email = ? OR username = ?
    LIMIT 1
  `;

  // בדיקת קיום המשתמש במסד הנתונים
  db.query(selectSql, [emailOrUsername, emailOrUsername], (err, results) => {
    if (err) {
      console.error("❌ שגיאת מסד נתונים:", err);
      return res.status(500).json({ error: "שגיאת שרת" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "המשתמש לא נמצא" });
    }

    const user = results[0];

    // אם המשתמש כבר מאומת – אין צורך בשליחה מחדש
    if (user.is_verified) {
      return res.status(400).json({ error: "המשתמש כבר מאומת" });
    }

    // יצירת טוקן אימות חדש
    const token = crypto.randomBytes(32).toString("hex");

    const updateSql = `
      UPDATE users 
      SET verification_token = ? 
      WHERE user_id = ?
    `;

    // עדכון הטוקן במסד הנתונים
    db.query(updateSql, [token, user.user_id], (updateErr) => {
      if (updateErr) {
        console.error("❌ שגיאה בעדכון טוקן:", updateErr);
        return res.status(500).json({ error: "נכשל עדכון טוקן" });
      }

      // בניית קישור אימות חדש
      const verifyUrl = `${process.env.FRONTEND_BASE_URL}/verify?token=${token}`;

      // הכנת הודעת המייל
      const mailOptions = {
        to: user.email,
        subject: 'אימות כתובת דוא"ל - Isra-Hand',
        html: emailVerificationTemplate(
          user.full_name || user.username,
          verifyUrl
        ),
      };

      // שליחת המייל בפועל
      sendMail(mailOptions)
        .then(() =>
          res.status(200).json({ message: "מייל אימות נשלח בהצלחה" })
        )
        .catch((mailErr) => {
          console.error("❌ שגיאת שליחת מייל:", mailErr);
          res.status(500).json({ error: "נכשל שליחת המייל" });
        });
    });
  });
};

module.exports = { resendVerification };
