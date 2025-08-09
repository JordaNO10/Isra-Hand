import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { getDonationById, deleteDonation, updateDonation } from "./donationService";
import { isDonor, isRequestor, isDonationOwner, isAdmin } from "./donationAccessControl";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true; // ensure cookies go to API

// Change this to your backend address if different in prod

export const useSinglePage = (donationId) => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = donationId;

  const [donationData, setDonationData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const isAdminUser = isAdmin();
  const isReqUser = isRequestor();
  const isDonorUser = isDonor();
  const currentUserId = Cookies.get("userId");
  const userRole = Cookies.get("userRole");
  const isGuest = !userRole;

  const hasSecureLockRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        let fetchedDonation;

        if (!isAdminUser && !isGuest) {
          const res = await axios.get(`/donations/${id}/secure`);
          if (!mounted) return;
          fetchedDonation = res.data;
          hasSecureLockRef.current = true;
        } else {
          const donation = await getDonationById(id);
          if (!mounted) return;
          fetchedDonation = donation;
        }

        const isOwner = isDonationOwner(fetchedDonation?.user_id);
        const allowedToView = isAdminUser || isOwner || isReqUser || isGuest || isDonorUser;
        if (!allowedToView) {
          setAccessDenied(true);
          return;
        }

        setDonationData(fetchedDonation);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403 || status === 423) setAccessDenied(true);
        else setError("Failed to load donation");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    const unlock = () => {
      if (!hasSecureLockRef.current) return;
      const url = `${API_BASE}/donations/${id}/unlock`
      const payload = JSON.stringify({});
      try {
        if (navigator.sendBeacon) {
          const data = new Blob([payload], { type: "application/json" });
          if (navigator.sendBeacon(url, data)) {
            hasSecureLockRef.current = false;
            return;
          }
        }
      } catch {}
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        credentials: "include",
        keepalive: true,
      }).finally(() => {
        hasSecureLockRef.current = false;
      });
    };

    // page/tab events
    const onBeforeUnload = () => unlock();
    const onPageHide = () => unlock();
    const onVisibility = () => {
      if (document.visibilityState === "hidden") unlock();
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("visibilitychange", onVisibility);

    // cleanup
    return () => {
      mounted = false;
      unlock();
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAdminUser, isGuest, location.pathname]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEdit = () => {
    setEditedData(donationData);
    setIsEditing(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const formData = new FormData();
      formData.append("donation_name", updatedData.donation_name);
      formData.append("email", updatedData.email);
      formData.append("description", updatedData.description);
      if (updatedData.image instanceof File) formData.append("image", updatedData.image);

      await updateDonation(id, formData);

      const refreshed = await getDonationById(id);
      setDonationData(refreshed);
      setIsEditing(false);
      window.location.reload();

      alert("השינויים נשמרו בהצלחה!");
    } catch (err) {
      console.error("❌ Save failed:", err);
      setError("Failed to save changes");
      alert("⚠️ שמירת התרומה נכשלה");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDonation(id);
      window.location.href = "/donations";
    } catch (err) {
      setError("Failed to delete donation");
    }
  };

  const handleDropdownChange = (newId) => {
    window.location.href = `/donations/${newId}`;
  };

  const requestDonation = async (donationId) => {
    try {
      await axios.put(`${API_BASE}/donations/${donationId}/request`, {
        requestor_id: currentUserId,
      });

      toast.success("הבקשה נשלחה בהצלחה! שלחנו התראה לתורם 🙌");
      setTimeout(() => window.location.reload(), 5500);
    } catch (err) {
      const msg = err?.response?.data?.error || "שגיאה בבקשת תרומה";
      toast.error(`שגיאה בבקשת תרומה: ${msg}`);
    }
  };

  const cancelRequest = async (donationId) => {
    try {
      await axios.put(`$/donations/${donationId}/cancel`, { requestor_id: currentUserId });
      window.location.reload();
    } catch (err) {
      alert("שגיאה בביטול תרומה: " + err.response?.data?.error);
    }
  };

  // Manual release — call this when your modal closes
  const releaseLock = async () => {
    if (!hasSecureLockRef.current) return;
    try {
      await axios.post(`/donations/${id}/unlock`, {});
    } catch {}
    hasSecureLockRef.current = false;
  };

  return {
    id,
    donationData,
    editedData,
    isEditing,
    loading,
    error,
    accessDenied,
    isModalOpen,
    openModal,
    closeModal,
    handleEdit,
    handleSave,
    handleDelete,
    setEditedData,
    handleDropdownChange,
    requestDonation,
    cancelRequest,
    releaseLock,
  };
};
