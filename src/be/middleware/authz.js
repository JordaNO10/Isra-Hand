/**
 * תפקיד הקובץ: בקרות הרשאה בצד השרת לפי מודל Admin/Member.
 * Admin (roleId=1) – הרשאות ניהול; Member (roleId=2) – יכול לתרום ולבקש.
 * הערה: משתמשים ב-session או בקוקיות כדי לזהות את roleId.
 */

const getRoleId = (req) => String(req.session?.roleId || req.cookies?.userRole || '');

 /**
  * פונקציה: requireAdmin
  * תיאור: מאפשרת גישה רק למשתמש בעל roleId=1 (Admin).
  */
module.exports.requireAdmin = (req, res, next) => {
  if (getRoleId(req) === '1') return next();
  return res.status(403).json({ error: 'Admin only' });
};

 /**
  * פונקציה: requireMember
  * תיאור: מאפשרת גישה רק למשתמש בעל roleId=2 (Member).
  * שימוש: כל פעולת תרומה/בקשה.
  */
module.exports.requireMember = (req, res, next) => {
  if (getRoleId(req) === '2') return next();
  return res.status(403).json({ error: 'Member only' });
};
