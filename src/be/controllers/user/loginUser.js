/**
 * התחברות משתמש
 * תפקיד: אימות פרטי משתמש, חסימת כניסה למשתמש לא מאומת, שמירת מזהה ותפקיד בסשן,
 *         אכיפת "סשן יחיד" (מחיקת כל הסשנים האחרים של המשתמש), והחזרת JSON עקבי.
 * דוגמת הרצה:
 *   curl -X POST http://localhost:5000/users/login -H "Content-Type: application/json" \
 *        -d "{\"emailOrUsername\":\"john@example.com\",\"password\":\"123456\"}"
 */
const bcrypt = require("bcrypt");
const { q, send500, normalizeRoleId } = require("../helpers/utils");

// --- עזרי DB קצרים ---
// שליפת משתמש לפי אימייל/שם משתמש
const findUser = async (emailOrUsername) => {
  const [rows] = await q(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [emailOrUsername, emailOrUsername]
  );
  return rows[0] || null;
};

// השוואת סיסמה
const passwordsMatch = (plain, user) => {
  const hash = user.password_hash || user.password; // תמיכה בשם עמודה משתנה
  return bcrypt.compare(plain, hash);
};

// כתיבת פרטים לסשן
const putInSession = (req, user) => {
  req.session.userId  = user.user_id;
  req.session.roleId  = normalizeRoleId(user.role_id);
  req.session.username= user.username;
};

// בניית תגובת לקוח
const buildResponse = (user) => ({
  message: "Signin successful!",
  userId: user.user_id,
  roleId: normalizeRoleId(user.role_id),
  username: user.username,
  fullName: user.full_name,
});

// ❗ אכיפת סשן יחיד: מחיקת כל הסשנים של המשתמש חוץ מהנוכחי
const clearOtherSessions = async (userId, currentSessionId) => {
  // נסיון ראשון: המידע בטור data נשמר כ-JSON ("userId": <id>)
  try {
    await q(
      "DELETE FROM sessions WHERE session_id <> ? AND JSON_EXTRACT(data,'$.userId') = ?",
      [currentSessionId, userId]
    );
    return;
  } catch (_) {
    // חנויות מסוימות שומרות JSON טקסטואלי – נשתמש ב-LIKE כנסיון נפילה
    await q(
      "DELETE FROM sessions WHERE session_id <> ? AND data LIKE ?",
      [currentSessionId, `%"userId":${Number(userId)}%`]
    );
  }
};

const saveSession = (req) =>
  new Promise((resolve, reject) => req.session.save((err) => (err ? reject(err) : resolve())));

// --- הבקר הראשי ---
const loginUser = async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    const user = await findUser(emailOrUsername);
    if (!user) return res.status(401).json({ error: "Invalid email/username or password." });

    if (!user.is_verified) {
      // חוסמים לא מאומתים – מאפשר ל-Frontend להציע "שלח שוב אימייל אימות"
      return res.status(403).json({ error: "אנא אמת את כתובת האימייל שלך" });
    }

    const ok = await passwordsMatch(password, user);
    if (!ok) return res.status(401).json({ error: "Invalid email/username or password." });

    // כתיבה לסשן ושמירה כדי לוודא שיש current session_id
    putInSession(req, user);
    await saveSession(req);

    // מחיקה של כל הסשנים האחרים של אותו משתמש (השארת הנוכחי בלבד)
    await clearOtherSessions(user.user_id, req.sessionID);

    return res.status(200).json(buildResponse(user));
  } catch (err) {
    return send500(res, "Database error", err);
  }
};

module.exports = loginUser;
