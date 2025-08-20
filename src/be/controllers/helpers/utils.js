/**
 * קובץ Utilities עבור בקרי המערכת.
 * כולל עטיפת שאילתות למסד הנתונים, טיפול בשגיאות,
 * וחילוץ מזהים ותפקידים מה־session או מה־cookies.
 */

const db = require("../../utils/db");

// הרצת שאילתה עם תמיכה ב־Promise
const q = (sql, params = []) => {
  if (typeof db.promise === "function") return db.promise().query(sql, params);
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve([rows])));
  });
};

// החזרת שגיאת 500 עם לוג
const send500 = (res, msg, err) => {
  if (err) console.error(msg, err);
  return res.status(500).json({ error: msg });
};

// המרה למספר או NULL
const toNumOrNull = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

// חילוץ userId – עדיפות ל־session, לאחר מכן cookie, ואז body
const getUserId = (req) => {
  const s = req.session || {};
  const u = s.user || {};
  const fromSession = s.userId || u.user_id;
  const fromCookie  = req.cookies?.userId;         
  const fromBody    = req.body?.user_id ?? req.body?.userId;

  const id = fromSession ?? fromCookie ?? fromBody ?? null;
  return toNumOrNull(id);
};

// נרמול roleId (3 → 2), עדיפות לערך מה־session
const normalizeRoleId = (roleId) => {
  const n = parseInt(roleId, 10);
  if (Number.isNaN(n)) return null;
  return n === 3 ? 2 : n;
};

// בדיקות הרשאות ותפקידים
const isAdmin    = (r) => normalizeRoleId(r) === 1;
const canDonate  = (r) => isAdmin(r) || normalizeRoleId(r) === 2;
const canRequest = (r) => isAdmin(r) || normalizeRoleId(r) === 2;

// חילוץ roleId – עדיפות ל־session, ולאחר מכן cookie ו־body
const getRoleId = (req) => {
  const s = req.session || {};
  const u = s.user || {};
  const fromSession = s.roleId ?? s.role_id ?? u.role_id;
  const fromCookie  = req.cookies?.userRole;       
  const fromBody    = req.body?.role_id ?? req.body?.userRole;
  const r = fromSession ?? fromCookie ?? fromBody ?? null;
  return normalizeRoleId(r);
};

module.exports = { q, send500, getUserId, normalizeRoleId, isAdmin, canDonate, canRequest, getRoleId };
