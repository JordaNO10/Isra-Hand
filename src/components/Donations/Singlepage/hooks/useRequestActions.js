/**
 * useRequestActions
 * תפקיד: בקשת תרומה/ביטול. שינוי: טיפול מפורש ב-403 "לא ניתן לבקש תרומה שהעלית".
 */
import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "./apiBase";

axios.defaults.withCredentials = true;

export const useRequestActions = () => {
  const userId = Cookies.get("userId");

  const requestDonation = async (donationId) => {
    try {
      await axios.put(apiUrl(`/donations/${donationId}/request`), { requestor_id: userId });
      alert("הבקשה נשלחה, התורם עודכן.");
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      const msg = e?.response?.data?.error || "שגיאה בבקשת תרומה";
      alert(msg); // אם 403 מהשרת — כאן תופיע ההודעה "לא ניתן לבקש תרומה שהעלית בעצמך"
    }
  };

  const cancelRequest = async (donationId) => {
    try {
      await axios.put(apiUrl(`/donations/${donationId}/cancel`), { requestor_id: userId });
      window.location.reload();
    } catch {
      alert("שגיאה בביטול הבקשה");
    }
  };

  return { requestDonation, cancelRequest };
};
