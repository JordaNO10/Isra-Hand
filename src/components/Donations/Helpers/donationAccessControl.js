import Cookies from "js-cookie";

/**
 * בדיקה אם המשתמש הנוכחי הוא בעל התרומה
 * @param {number|string} donationUserId
 * @returns {boolean}
 */
export const isDonationOwner = (donationUserId) => {
  const currentUserId = Cookies.get("userId");
  return String(currentUserId) === String(donationUserId);
};

/**
 * בדיקה אם למשתמש יש תפקיד "תורם"
 * @returns {boolean}
 */
export const isDonor = () => Cookies.get("userRole") === "2";

/**
 * בדיקה אם למשתמש יש תפקיד "אדמין"
 * @returns {boolean}
 */
export const isAdmin = () => Cookies.get("userRole") === "1";

/**
 * בדיקה אם למשתמש יש תפקיד "מבקש"
 * @returns {boolean}
 */
export const isRequestor = () => Cookies.get("userRole") === "3";

/**
 * בדיקה האם תרומה נעולה (נצפתה ב־5 הדקות האחרונות)
 * @param {string} donationId
 * @returns {boolean}
 */
export const isDonationLocked = (donationId) => {
  const lockKey = `donation_lock_${donationId}`;
  const lockTimestamp = sessionStorage.getItem(lockKey);
  if (!lockTimestamp) return false;
  return Date.now() - Number(lockTimestamp) < 5 * 60 * 1000;
};

/**
 * נעילת תרומה ב־sessionStorage
 * @param {string} donationId
 */
export const lockDonation = (donationId) => {
  const lockKey = `donation_lock_${donationId}`;
  sessionStorage.setItem(lockKey, Date.now());
};
