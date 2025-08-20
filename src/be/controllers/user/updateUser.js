/**
 * קובץ זה אחראי על עדכון משתמשים במערכת:
 * - עדכון שדות באופן דינמי לפי בקשת הלקוח
 * - נרמול מזהה תפקיד (role_id) לפני שמירה
 * - החזרת הודעת הצלחה או שגיאה בהתאם לתוצאה
 */

const db = require("../../utils/db");
const { normalizeRoleId } = require("../helpers/utils");

/**
 * בקר עדכון משתמש
 * @param {Object} req - בקשת HTTP (כוללת מזהה משתמש ונתונים לעדכון)
 * @param {Object} res - תגובת HTTP עם סטטוס ותוצאה
 */
const updateUser = (req, res) => {
  const { id } = req.params;
  const { username, full_name, role_id, email, birth_date, address, phone_number } = req.body;

  // נרמול תפקיד (לדוגמה: 3 → 2)
  const normalizedRoleId = typeof role_id !== "undefined" ? normalizeRoleId(role_id) : undefined;

  // בניית רשימת השדות לעדכון בצורה דינמית
  const updates = [];
  const values = [];

  if (typeof normalizedRoleId !== "undefined") {
    updates.push("role_id = ?");
    values.push(normalizedRoleId);
  }
  if (username !== undefined) {
    updates.push("username = ?");
    values.push(username);
  }
  if (full_name !== undefined) {
    updates.push("full_name = ?");
    values.push(full_name);
  }
  if (email !== undefined) {
    updates.push("email = ?");
    values.push(email);
  }
  if (birth_date !== undefined) {
    updates.push("birth_date = ?");
    values.push(birth_date);
  }
  if (address !== undefined) {
    updates.push("address = ?");
    values.push(address);
  }
  if (phone_number !== undefined) {
    updates.push("phone_number = ?");
    values.push(phone_number);
  }

  // אם לא נשלחו שדות לעדכון
  if (updates.length === 0) {
    return res.status(400).json({ error: "לא נשלחו שדות לעדכון." });
  }

  const sql = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
  values.push(id);

  // ביצוע עדכון במסד הנתונים
  db.query(sql, values, (error, results) => {
    if (error) {
      console.error("❌ שגיאת מסד נתונים בעת עדכון משתמש:", error);
      return res.status(500).json({ error: "שגיאת מסד נתונים" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "המשתמש לא נמצא." });
    }
    return res.status(200).json({ message: "המשתמש עודכן בהצלחה." });
  });
};

module.exports = updateUser;
