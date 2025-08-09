/**
 * useRequestActions
 * אחריות: בקשת תרומה וביטול בקשה.
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
      alert("שגיאה בבקשת תרומה");
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
