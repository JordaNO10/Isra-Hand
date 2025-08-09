// controllers/_helpers/utils.js
/**
 * Module: Controller utilities (BE View-Model)
 * Purpose: Tiny helpers to keep controllers short & consistent.
 */
const db = require("../../utils/db");

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

module.exports = { q, getUserId, send500 };
