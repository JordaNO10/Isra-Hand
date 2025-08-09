// controllers/helpers/utils.js
/**
 * Utilities לבקרים
 * תפקיד: עטיפת שאילתות, טיפול שגיאות, חילוץ מזהים ותפקידים.
 * אבטחה: סומכים על סשן (HttpOnly). cookie צד-לקוח משמש Fallback בלבד ובזהירות.
 */
const db = require("../../utils/db");

const q = (sql, params = []) => {
  if (typeof db.promise === "function") return db.promise().query(sql, params);
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, rows) => (err ? reject(err) : resolve([rows])));
  });
};

const send500 = (res, msg, err) => {
  if (err) console.error(msg, err);
  return res.status(500).json({ error: msg });
};

const toNumOrNull = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
};

// ⚠️ קודם סשן (בטוח), אח"כ cookie כ-fallback, אח"כ body לתאימות.
const getUserId = (req) => {
  const s = req.session || {};
  const u = s.user || {};
  const fromSession = s.userId || u.user_id;
  const fromCookie  = req.cookies?.userId;         // לא-HttpOnly → fallback בלבד
  const fromBody    = req.body?.user_id ?? req.body?.userId;

  const id = fromSession ?? fromCookie ?? fromBody ?? null;
  return toNumOrNull(id);
};

// נרמול תפקידים: 3 → 2; עדיפות לסשן.
const normalizeRoleId = (roleId) => {
  const n = parseInt(roleId, 10);
  if (Number.isNaN(n)) return null;
  return n === 3 ? 2 : n;
};

const isAdmin    = (r) => normalizeRoleId(r) === 1;
const canDonate  = (r) => isAdmin(r) || normalizeRoleId(r) === 2;
const canRequest = (r) => isAdmin(r) || normalizeRoleId(r) === 2;

const getRoleId = (req) => {
  const s = req.session || {};
  const u = s.user || {};
  const fromSession = s.roleId ?? s.role_id ?? u.role_id;
  const fromCookie  = req.cookies?.userRole;       // fallback בלבד
  const fromBody    = req.body?.role_id ?? req.body?.userRole;
  const r = fromSession ?? fromCookie ?? fromBody ?? null;
  return normalizeRoleId(r);
};

module.exports = { q, send500, getUserId, normalizeRoleId, isAdmin, canDonate, canRequest, getRoleId };
