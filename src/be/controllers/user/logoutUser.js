/**
 * קובץ זה אחראי על התנתקות משתמשים מהמערכת:
 * - מחיקת הסשן הקיים
 * - ניקוי עוגיית הסשן מהדפדפן
 * - החזרת תגובה ללקוח
 */

/**
 * בקר התנתקות משתמש
 * @param {Object} req - בקשת HTTP (כוללת מידע על הסשן הנוכחי)
 * @param {Object} res - תגובת HTTP ללקוח
 */
const logoutUser = (req, res) => {
  // אם אין סשן פעיל
  if (!req.session) {
    return res.status(400).json({ error: "לא נמצא סשן פעיל." });
  }

  // מחיקת הסשן מהשרת
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "כשלון בהתנתקות." });
    }

    // ניקוי עוגיית הסשן מהדפדפן
    res.clearCookie("connect.sid");

    // החזרת הודעת הצלחה
    res.status(200).json({ message: "התנתקת בהצלחה." });
  });
};

module.exports = logoutUser;
