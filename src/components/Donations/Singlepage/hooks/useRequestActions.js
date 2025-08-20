/**
 * useRequestActions
 * Role: request/cancel donation with user-friendly toasts.
 * Notes: Replaces alert() with react-toastify. Handles 403 explicitly.
 */
import axios from "axios";
import Cookies from "js-cookie";
import { apiUrl } from "./apiBase";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const serverMessage = (e) =>
  e?.response?.data?.error ||
  e?.response?.data?.message ||
  e?.message ||
  "שגיאה לא ידועה";

export const useRequestActions = () => {
  const userId = Cookies.get("userId");

  const requestDonation = async (donationId) => {
    try {
      await axios.put(apiUrl(`/donations/${donationId}/request`), {
        requestor_id: userId,
      });
      toast.success("✅ הבקשה נשלחה, התורם עודכן.", {
        autoClose: 2500,
        onClose: () => window.location.reload(),
      });
    } catch (e) {
      const status = e?.response?.status;
      const msg = serverMessage(e);
      if (status === 403) {
        // e.g., "לא ניתן לבקש תרומה שהעלית בעצמך"
        toast.info(msg || "לא ניתן לבקש תרומה שהעלית בעצמך.", {
          autoClose: 3000,
        });
      } else {
        toast.error("❌ " + msg, { autoClose: 3500 });
      }
    }
  };

  const cancelRequest = async (donationId) => {
    try {
      await axios.put(apiUrl(`/donations/${donationId}/cancel`), {
        requestor_id: userId,
      });
      toast.success("הבקשה בוטלה.", {
        autoClose: 2000,
        onClose: () => window.location.reload(),
      });
    } catch (e) {
      toast.error("שגיאה בביטול הבקשה: " + serverMessage(e), {
        autoClose: 3500,
      });
    }
  };

  return { requestDonation, cancelRequest };
};
