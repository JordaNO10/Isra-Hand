// controllers/_helpers/utils.js
/**
 * מודול עזר לבקרים (Utilities)
 * תפקיד: ריכוז פונקציות עזר לשימוש חוזר בבקרים כדי לשמור על קוד קצר ואחיד.
 * כולל:
 *  - עטיפת שאילתות Promise (q)
 *  - חילוץ מזהה משתמש (getUserId)
 *  - טיפול בשגיאות 500 (send500)
 *  - עזרי תפקידים עם תאימות לאחור (normalizeRoleId / isAdmin / canDonate / canRequest / getRoleId)
 * הנחיות: פונקציות קצרות, שמות ברורים, ללא מחיקת קוד קיים.
 */
const db = require("./db");

// Promise-based query wrapper
const q = (sql, params = []) => db.promise().query(sql, params);

// Extract user id from session (fallbacks to body for backward-compat)
const getUserId = (req) => {
  const s = req.session || {};
  const u = s.user || {};
  return s.userId || u.user_id || req.body.user_id || req.body.requestor_id || null;
};

// Standard 500 with optional logging
const send500 = (res, msg, err) => {
  if (err) console.error(msg, err);
  return res.status(500).json({ error: msg });
};

// --- Role helpers (Admin/Member) ---
const normalizeRoleId = (roleId) => {
  const n = parseInt(roleId, 10);
  if (Number.isNaN(n)) return null;
  return n === 3 ? 2 : n; // תאימות לאחור: Requestor(3) -> Member(2)
};

const isAdmin   = (roleId) => normalizeRoleId(roleId) === 1;
const canDonate = (roleId) => normalizeRoleId(roleId) === 2 || isAdmin(roleId);
const canRequest= (roleId) => normalizeRoleId(roleId) === 2 || isAdmin(roleId);

const getRoleId = (req) => {
  const s = req.session || {};
  const u = s.user || {};
  const sessionRole = s.roleId || s.role_id || u.role_id;
  const cookieRole  = (req.cookies && (req.cookies.userRole || req.cookies.role_id)) || null;
  const bodyRole    = (req.body && (req.body.role_id || req.body.userRole)) || null;
  return normalizeRoleId(sessionRole || cookieRole || bodyRole);
};

module.exports = { q, getUserId, send500, normalizeRoleId, isAdmin, canDonate, canRequest, getRoleId };
