/**
 * עזרי דף הבית:
 * טעינת תרומות אחרונות + ספירת משתמשים לפי תפקיד + בדיקות תפקיד משתמש נוכחי.
 */
import axios from "axios";
import { getAvailableDonations } from "../../Donations/Helpers/donationService"; // ודאי שהנתיב נכון
import Cookies from "js-cookie";

/** פורמט תאריך להצגה (DD-MM-YYYY) */
const formatDateForDisplay = (iso) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
};

/** מיון לפי תאריך תרומה (יורד) */
const sortByDateDesc = (rows) =>
  [...rows].sort((a, b) => new Date(b.donation_date) - new Date(a.donation_date));

/** הסרת תרומה אחת שכבר משויכת (אם קיימת) — שמירת UX נקי */
const stripOneRequested = (rows) => {
  const idx = rows.findIndex((d) => d.requestor_id !== null);
  return idx >= 0 ? rows.filter((_, i) => i !== idx) : rows;
};

/** החזרת 8 האחרונות עם שדה תאריך מפורמט */
const takeLatest8 = (rows) =>
  rows.slice(0, 8).map((d) => ({ ...d, donation_date_formatted: formatDateForDisplay(d.donation_date) }));

/**
 * שליפת תרומות לדף הבית:
 * - לוקח את כל הזמינות
 * - מסיר אחת “משויכת” אם קיימת
 * - ממיין לפי תאריך
 * - מחזיר 8 אחרונות + סך הכל
 */
export const fetchHomepageDonations = async () => {
  const all = await getAvailableDonations();
  const cleaned = stripOneRequested(all);
  const latest = takeLatest8(sortByDateDesc(cleaned));
  return { latest, total: cleaned.length };
};

/** ספירת משתמשים לפי תפקיד (2: Donor, 3: Requestor) */
export const fetchUserRoleCounts = async () => {
  const { data: users } = await axios.get("/users", { withCredentials: true });
  const count = (role) => users.filter((u) => u.role_id === role).length;
  return { donors: count(2), requestors: count(3) };
};

/** בדיקת תפקיד המשתמש הנוכחי: תורם */
export const isUserDonor = () => Cookies.get("userRole") === "2";

/** בדיקת תפקיד המשתמש הנוכחי: מבקש */
export const isUserRequestor = () => Cookies.get("userRole") === "3";
