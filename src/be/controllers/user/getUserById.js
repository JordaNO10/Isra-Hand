/**
 * קובץ זה אחראי על שליפת פרטי משתמש בודד לפי מזהה (user_id),
 * כולל שם התפקיד (Role) ופורמט תאריכים בצורה קריאה.
 */

const db = require("../../utils/db");

/**
 * פונקציה לשליפת משתמש לפי מזהה
 * @param {Object} req - בקשת HTTP המכילה user_id בפרמטרים
 * @param {Object} res - תגובת HTTP שמחזירה את פרטי המשתמש
 */
const getUserById = (req, res) => {
  const { id } = req.params; // שליפת מזהה המשתמש מה-URL

  const sql = `
    SELECT users.*, roles.role_name
    FROM users 
    JOIN roles ON users.role_id = roles.role_id
    WHERE users.user_id = ?`;

  // ביצוע השאילתה מול מסד הנתונים
  db.query(sql, [id], (error, results) => {
    if (error) {
      console.error("שגיאת מסד נתונים בעת שליפת המשתמש:", error);
      return res.status(500).json({ error: "שגיאת מסד נתונים" });
    }

    // אם לא נמצא משתמש עם ה-ID המבוקש
    if (results.length === 0) {
      return res.status(404).json({ error: "המשתמש לא נמצא" });
    }

    const user = results[0];

    // פורמט תאריך לידה לצורה: YYYY-MM-DD
    if (user.birth_date) {
      user.birth_date = new Date(user.birth_date).toISOString().split("T")[0];
    }

    // פורמט תאריך התחברות אחרונה לצורה: YYYY-MM-DD HH:MM:SS
    if (user.last_login) {
      const date = new Date(user.last_login);
      const yyyy = date.getFullYear();
      const MM = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");

      user.last_login = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
    }

    // החזרת המשתמש כ-JSON
    res.status(200).json(user);
  });
};

module.exports = getUserById;
