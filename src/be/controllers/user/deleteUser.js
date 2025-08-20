/**
 * קובץ זה אחראי על מחיקת משתמש מהמערכת לפי user_id.
 * מתבצע חיבור למסד הנתונים והרצת שאילתת DELETE.
 */

const db = require("../../utils/db");

/**
 * פונקציה למחיקת משתמש מהמערכת
 * @param {Object} req - בקשת HTTP המכילה מזהה משתמש בפרמטרים
 * @param {Object} res - תגובת HTTP שמוחזרת ללקוח
 */
const deleteUser = (req, res) => {
  const { id } = req.params; // שליפת מזהה המשתמש מה-URL

  const sql = "DELETE FROM users WHERE user_id = ?";

  // ביצוע השאילתה מול מסד הנתונים
  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("שגיאת מסד נתונים בעת מחיקת המשתמש:", error);
      return res.status(500).json({ error: "שגיאת מסד נתונים" });
    }

    // בדיקה אם לא נמחק אף משתמש (לא נמצא משתמש עם ה-ID הזה)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "המשתמש לא נמצא" });
    }

    // מחיקה בוצעה בהצלחה
    res.status(200).json({ message: "המשתמש נמחק בהצלחה" });
  });
};

module.exports = deleteUser;
