/**
 * useSinglePage
 * תפקיד: מסך תרומה בודדת – טעינה מאובטחת/ציבורית, עריכה/מחיקה, בקשה/ביטול, ונעילה.
 * שינויים:
 *  - הסרת תלות ב-API_BASE; שימוש בנתיבים יחסיים עם withCredentials.
 *  - תיקון כתובת cancel (הוסר $ מיותר).
 *  - unlock מסודר ב-unload/pagehide/visibilitychange + קריאה ידנית.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { getDonationById, deleteDonation, updateDonation } from "./donationService";
import { isDonor, isRequestor, isDonationOwner, isAdmin } from "./donationAccessControl";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

export const useSinglePage = (donationId) => {
  const navigate = useNavigate();
  const location = useLocation();
  const id       = donationId;

  const [donationData, setDonationData] = useState(null);
  const [editedData, setEditedData]     = useState({});
  const [isEditing, setIsEditing]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const isAdminUser = isAdmin();
  const isReqUser   = isRequestor();
  const isDonorUser = isDonor();
  const currentUserId = Cookies.get("userId");
  const isGuest = !Cookies.get("userRole");

  const hasSecureLockRef = useRef(false);

  // --- טענת תרומה (מאובטח/ציבורי) ---
  const loadDonation = useCallback(async () => {
    try {
      let fetched;
      if (!isAdminUser && !isGuest) {
        const { data } = await axios.get(`/donations/${id}/secure`);
        fetched = data;
        hasSecureLockRef.current = true;
      } else {
        fetched = await getDonationById(id);
      }

      const owner = isDonationOwner(fetched?.user_id);
      const allowed = isAdminUser || owner || isReqUser || isGuest || isDonorUser;
      if (!allowed) { setAccessDenied(true); return; }

      setDonationData(fetched);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403 || status === 423) setAccessDenied(true);
      else setError("Failed to load donation");
    } finally {
      setLoading(false);
    }
  }, [id, isAdminUser, isGuest, isReqUser, isDonorUser]);

  useEffect(() => { setLoading(true); loadDonation(); }, [loadDonation, location.pathname]);

  // --- שחרור נעילה (Beacon/Fetch) ---
  const releaseLock = useCallback(async () => {
    if (!hasSecureLockRef.current) return;
    const url = `/donations/${id}/unlock`;
    const payload = JSON.stringify({});
    try {
      if (navigator.sendBeacon) {
        const data = new Blob([payload], { type: "application/json" });
        if (navigator.sendBeacon(url, data)) { hasSecureLockRef.current = false; return; }
      }
    } catch {}
    try { await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, credentials: "include", keepalive: true }); }
    finally { hasSecureLockRef.current = false; }
  }, [id]);

  useEffect(() => {
    const onBeforeUnload = () => releaseLock();
    const onPageHide     = () => releaseLock();
    const onVisibility   = () => { if (document.visibilityState === "hidden") releaseLock(); };

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      releaseLock();
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [releaseLock]);

  // --- פעולות UI ---
  const openModal  = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleEdit = () => { setEditedData(donationData); setIsEditing(true); };

  const handleSave = async (updatedData) => {
    try {
      const formData = new FormData();
      formData.append("donation_name", updatedData.donation_name);
      formData.append("email",         updatedData.email);
      formData.append("description",   updatedData.description);
      if (updatedData.image instanceof File) formData.append("image", updatedData.image);

      await updateDonation(id, formData);
      const refreshed = await getDonationById(id);
      setDonationData(refreshed); setIsEditing(false);
      window.location.reload();
      alert("השינויים נשמרו בהצלחה!");
    } catch (err) {
      console.error("❌ Save failed:", err);
      setError("Failed to save changes");
      alert("⚠️ שמירת התרומה נכשלה");
    }
  };

  const handleDelete = async () => {
    try { await deleteDonation(id); window.location.href = "/donations"; }
    catch { setError("Failed to delete donation"); }
  };

  const handleDropdownChange = (newId) => { window.location.href = `/donations/${newId}`; };

  const requestDonation = async (donationId) => {
    try {
      await axios.put(`/donations/${donationId}/request`, { requestor_id: currentUserId });
      toast.success("הבקשה נשלחה בהצלחה! שלחנו התראה לתורם 🙌");
      setTimeout(() => window.location.reload(), 5500);
    } catch (err) {
      const msg = err?.response?.data?.error || "שגיאה בבקשת תרומה";
      toast.error(`שגיאה בבקשת תרומה: ${msg}`);
    }
  };

  const cancelRequest = async (donationId) => {
    try {
      await axios.put(`/donations/${donationId}/cancel`, { requestor_id: currentUserId });
      window.location.reload();
    } catch (err) {
      alert("שגיאה בביטול תרומה: " + (err.response?.data?.error || ""));
    }
  };

  return {
    id, donationData, editedData, isEditing, loading, error, accessDenied,
    isModalOpen, openModal, closeModal, handleEdit, handleSave, handleDelete,
    setEditedData, handleDropdownChange, requestDonation, cancelRequest, releaseLock,
  };
};
