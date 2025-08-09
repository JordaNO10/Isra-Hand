import Cookies from "js-cookie";

/**
 * Checks if the current user is the owner of the donation
 * @param {number|string} donationUserId
 * @returns {boolean}
 */
export const isDonationOwner = (donationUserId) => {
  const currentUserId = Cookies.get("userId");
  return String(currentUserId) === String(donationUserId);
};

/**
 * Checks if the current user has the donor role
 * @returns {boolean}
 */
export const isDonor = () => {
  return Cookies.get("userRole") === "2";
};
/**
 * Checks if the current user has the Admin role
 * @returns {boolean}
 */
export const isAdmin = () => {
  return Cookies.get("userRole") === "1";
};

/**
 * Checks if the current user has the requestor role
 * @returns {boolean}
 */
export const isRequestor = () => {
  return Cookies.get("userRole") === "3";
};

/**
 * Determines if a donation is locked (viewed within 5 min)
 * @param {string} donationId
 * @returns {boolean}
 */
export const isDonationLocked = (donationId) => {
  const lockKey = `donation_lock_${donationId}`;
  const lockTimestamp = sessionStorage.getItem(lockKey);
  if (!lockTimestamp) return false;
  const now = Date.now();
  return now - Number(lockTimestamp) < 5 * 60 * 1000;
};

/**
 * Locks a donation in session storage
 * @param {string} donationId
 */
export const lockDonation = (donationId) => {
  const lockKey = `donation_lock_${donationId}`;
  sessionStorage.setItem(lockKey, Date.now());
};
