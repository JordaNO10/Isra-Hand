/**
 * requireAuth
 * תפקיד: חסימת בקשות מוגנות כשאין סשן פעיל.
 * הערה: שמור על פונקציות קצרות; לא מוחק לוגיקה קיימת—רק מוסיף בלם.
 */
const requireAuth = (req, res, next) => {
  if (req.session?.userId) return next();
  return res.status(401).json({ error: "Unauthorized" });
};

module.exports = requireAuth;
