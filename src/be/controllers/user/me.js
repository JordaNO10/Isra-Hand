/**
 * קובץ זה אחראי על בדיקת מצב התחברות ("אני"):
 * - החזרת פרטי המשתמש מתוך הסשן הפעיל
 * - במקרה שאין סשן תקף – החזרת שגיאה 401
 * שימוש: GET /users/me (עם withCredentials)
 */

const { normalizeRoleId } = require("../helpers/utils");

/**
 * בקר החזרת מצב התחברות
 * @param {Object} req - בקשת HTTP (כוללת את פרטי הסשן)
 * @param {Object} res - תגובת HTTP עם פרטי המשתמש או שגיאה
 */
const me = (req, res) => {
  const s = req.session || {};

  // אין סשן או שהמשתמש לא מחובר
  if (!s.userId) {
    return res.status(401).json({ error: "לא מורשה" });
  }

  // החזרת פרטי המשתמש מהסשן
  return res.json({
    userId: s.userId,
    roleId: normalizeRoleId(s.roleId),
    username: s.username || null,
  });
};

module.exports = me;
