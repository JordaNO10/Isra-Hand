// controllers/_helpers/utils.js
/**
 * מודול עזר לבקרים (Utilities)
 * תפקיד: ריכוז פונקציות עזר לשימוש חוזר בבקרים, במטרה לשמור על קוד נקי, קצר ואחיד.
 * כולל:
 *  - q: עטיפת שאילתות ב-Promise
 *  - getUserId: חילוץ מזהה משתמש מהסשן / קוקי / גוף הבקשה
 *  - send500: טיפול בשגיאות שרת (500) עם לוג
 *  - normalizeRoleId: נרמול מזהי תפקידים (כולל תאימות לאחור)
 *  - isAdmin, canDonate, canRequest: בדיקות הרשאות לפי תפקיד
 *  - getRoleId: החזרת מזהה תפקיד של המשתמש מהקשר הנוכחי
 */

const db = require("./db");

// עטיפת שאילתות עם Promise
const q = (sql, params = []) => db.promise().query(sql, params);

// חילוץ מזהה משתמש מתוך סשן / גוף בקשה / תאימות לאחור
const getUserId = (req) => {
  const s = req.session || {};
  const u = s.user || {};
  return (
    s.userId ||
    u.user_id ||
    req.body.user_id ||
    req.body.requestor_id ||
    null
  );
};

// החזרת שגיאת 500 סטנדרטית + לוג במקרה הצורך
const send500 = (res, msg, err) => {
  if (err) console.error(msg, err);
  return res.status(500).json({ error: msg });
};

// --- עזרי תפקידים (Admin/Member) ---
// נרמול מזהה תפקיד (כולל תאימות לאחור: Requestor(3) -> Member(2))
const normalizeRoleId = (roleId) => {
  const n = parseInt(roleId, 10);
  if (Number.isNaN(n)) return null;
  return n === 3 ? 2 : n;
};

// בדיקת הרשאות לפי תפקיד
const isAdmin    = (roleId) => normalizeRoleId(roleId) === 1;
const canDonate  = (roleId) => normalizeRoleId(roleId) === 2 || isAdmin(roleId);
const canRequest = (roleId) => normalizeRoleId(roleId) === 2 || isAdmin(roleId);

// חילוץ תפקיד המשתמש מהסשן / קוקיז / גוף בקשה
const getRoleId = (req) => {
  const s = req.session || {};
  const u = s.user || {};
  const sessionRole = s.roleId || s.role_id || u.role_id;
  const cookieRole  = (req.cookies && (req.cookies.userRole || req.cookies.role_id)) || null;
  const bodyRole    = (req.body && (req.body.role_id || req.body.userRole)) || null;
  return normalizeRoleId(sessionRole || cookieRole || bodyRole);
};

// ייצוא כל פונקציות העזר
module.exports = { q, getUserId, send500, normalizeRoleId, isAdmin, canDonate, canRequest, getRoleId };
