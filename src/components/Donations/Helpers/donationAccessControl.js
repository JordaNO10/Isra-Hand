/**
 * donationAccessControl
 * תפקיד: בדיקות הרשאות/בעלות בצד הלקוח.
 * שינוי: נרמול תפקיד 3 → 2; חבר (2) נחשב גם תורם וגם מבקש. אדמין (1) כנ"ל.
 */
import Cookies from "js-cookie";

const normalizeRole = (r) => {
  const s = String(r ?? "");
  if (s === "3") return "2"; // תאימות לאחור
  if (s === "1" || s === "2") return s;
  return "";
};

export const isDonationOwner = (donationUserId) => {
  const currentUserId = Cookies.get("userId");
  return String(currentUserId) === String(donationUserId);
};

export const isAdmin = () => normalizeRole(Cookies.get("userRole")) === "1";

// חבר (2) ואדמין (1) → תורם
export const isDonor = () => {
  const r = normalizeRole(Cookies.get("userRole"));
  return r === "2" || r === "1";
};

// חבר (2) ואדמין (1) → מבקש
export const isRequestor = () => {
  const r = normalizeRole(Cookies.get("userRole"));
  return r === "2" || r === "1";
};

export const isDonationLocked = (donationId) => {
  const lockKey = `donation_lock_${donationId}`;
  const lockTimestamp = sessionStorage.getItem(lockKey);
  if (!lockTimestamp) return false;
  return Date.now() - Number(lockTimestamp) < 5 * 60 * 1000;
};

export const lockDonation = (donationId) => {
  const lockKey = `donation_lock_${donationId}`;
  sessionStorage.setItem(lockKey, Date.now());
};
