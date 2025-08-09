/**
 * עזר לקביעת בסיס ה־API (ניתן לקבוע דרך ENV; אחרת נתיבים יחסיים).
 */
export const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  (typeof process !== "undefined" && process.env?.VITE_API_BASE) ||
  "";

export const apiUrl = (path) => `${API_BASE}${path}`;
