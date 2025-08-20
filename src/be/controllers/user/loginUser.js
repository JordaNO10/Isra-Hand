/**
 * קובץ זה אחראי על התחברות משתמשים:
 * - אימות פרטי משתמש מול מסד הנתונים
 * - חסימת כניסה למשתמש לא מאומת
 * - שמירת מזהה ותפקיד המשתמש בסשן
 * - אכיפת סשן יחיד (מחיקת סשנים אחרים)
 * - החזרת תגובה עקבית ללקוח
 */

const bcrypt = require("bcrypt");
const { q, send500, normalizeRoleId } = require("../helpers/utils");

/**
 * שליפת משתמש לפי אימייל או שם משתמש
 * @param {string} emailOrUsername - אימייל או שם משתמש
 * @returns {Object|null} משתמש אם נמצא, אחרת null
 */
const findUser = async (emailOrUsername) => {
  const [rows] = await q(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [emailOrUsername, emailOrUsername]
  );
  return rows[0] || null;
};

/**
 * השוואת סיסמה מול ההאש השמור
 * @param {string} plain - סיסמה שהוזנה
 * @param {Object} user - אובייקט משתמש ממסד הנתונים
 * @returns {Promise<boolean>} תוצאה אם הסיסמאות תואמות
 */
const passwordsMatch = (plain, user) => {
  const hash = user.password_hash || user.password;
  return bcrypt.compare(plain, hash);
};

/**
 * שמירת פרטי משתמש בסשן
 * @param {Object} req - בקשת HTTP
 * @param {Object} user - אובייקט משתמש
 */
const putInSession = (req, user) => {
  req.session.userId   = user.user_id;
  req.session.roleId   = normalizeRoleId(user.role_id);
  req.session.username = user.username;
};

/**
 * בניית תגובת JSON עקבית ללקוח לאחר התחברות
 * @param {Object} user - אובייקט משתמש
 * @returns {Object} תגובה ללקוח
 */
const buildResponse = (user) => ({
  message: "Signin successful!",
  userId: user.user_id,
  roleId: normalizeRoleId(user.role_id),
  username: user.username,
  fullName: user.full_name,
});

/**
 * אכיפת סשן יחיד – מחיקת סשנים אחרים של אותו משתמש
 * @param {number} userId - מזהה המשתמש
 * @param {string} currentSessionId - מזהה הסשן הנוכחי
 */
const clearOtherSessions = async (userId, currentSessionId) => {
  try {
    await q(
      "DELETE FROM sessions WHERE session_id <> ? AND JSON_EXTRACT(data,'$.userId') = ?",
      [currentSessionId, userId]
    );
    return;
  } catch (_) {
    await q(
      "DELETE FROM sessions WHERE session_id <> ? AND data LIKE ?",
      [currentSessionId, `%"userId":${Number(userId)}%`]
    );
  }
};

/**
 * שמירת סשן נוכחי
 * @param {Object} req - בקשת HTTP
 */
const saveSession = (req) =>
  new Promise((resolve, reject) => req.session.save((err) => (err ? reject(err) : resolve())));

/**
 * בקר התחברות ראשי
 * @param {Object} req - בקשת HTTP (מכילה אימייל/שם משתמש וסיסמה)
 * @param {Object} res - תגובת HTTP עם סטטוס ותוכן JSON
 */
const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await findUser(emailOrUsername);
    if (!user) return res.status(401).json({ error: "אימייל/שם משתמש או סיסמה לא נכונים." });

    if (!user.is_verified) {
      return res.status(403).json({ error: "אנא אמת את כתובת האימייל שלך" });
    }

    const ok = await passwordsMatch(password, user);
    if (!ok) return res.status(401).json({ error: "אימייל/שם משתמש או סיסמה לא נכונים." });

    putInSession(req, user);
    await saveSession(req);

    await clearOtherSessions(user.user_id, req.sessionID);

    return res.status(200).json(buildResponse(user));
  } catch (err) {
    return send500(res, "שגיאת מסד נתונים", err);
  }
};

module.exports = loginUser;
