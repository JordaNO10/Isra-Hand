/**
 * קובץ זה אחראי על שליפת כל המשתמשים מהמערכת,
 * כולל שם התפקיד (Role) של כל משתמש.
 */

const db = require("../../utils/db");

/**
 * פונקציה לשליפת כל המשתמשים מהמערכת
 * @param {Object} req - בקשת HTTP
 * @param {Object} res - תגובת HTTP שמחזירה רשימת משתמשים
 */
const getAllUsers = (req, res) => {
  const sql = `
    SELECT users.*, roles.role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.role_id`;

  // ביצוע השאילתה מול מסד הנתונים
  db.query(sql, (error, results) => {
    if (error) {
      console.error("שגיאת מסד נתונים בעת שליפת המשתמשים:", error);
      return res.status(500).json({ error: "שגיאת מסד נתונים" });
    }

    // החזרת רשימת המשתמשים שנמצאו
    res.status(200).json(results);
  });
};

module.exports = getAllUsers;
