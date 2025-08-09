/**
 * מצב התחברות ("אני")
 * תפקיד: החזרת פרטי המשתמש מהסשן הפעיל. אם אין סשן תקף – 401.
 * שימוש: GET /users/me (עם withCredentials)
 */
const { normalizeRoleId } = require("../helpers/utils");

const me = (req, res) => {
  const s = req.session || {};
  if (!s.userId) return res.status(401).json({ error: "Unauthorized" });

  return res.json({
    userId: s.userId,
    roleId: normalizeRoleId(s.roleId),
    username: s.username || null,
  });
};

module.exports = me;
