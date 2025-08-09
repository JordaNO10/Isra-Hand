/**
 * הוק לניהול לוגיקת בקשת תרומה/ביטול/דירוג.
 * שינוי: לפני שליחת בקשה – בדיקה שהמשתמש אינו המעלה (owner).
 */
import { useState } from "react";
import Cookies from "js-cookie";

export const useRequestFlow = (donationData, requestDonation, cancelRequest) => {
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const isOwner = () => {
    const me = Cookies.get("userId");
    return donationData?.user_id && me && String(donationData.user_id) === String(me);
  };

  // שליחת בקשה (חבר יכול לבקש, אבל לא על תרומה שהוא העלה)
  const handleRequest = async () => {
    if (!donationData) return;
    if (isOwner()) { alert("לא ניתן לבקש תרומה שהעלית בעצמך"); return; }
    setLoadingRequest(true);
    try {
      await requestDonation(donationData.donation_id);
      setTimeout(() => window.location.reload(), 800);
    } catch { setLoadingRequest(false); }
  };

  const handleCancel = async () => {
    if (!donationData) return;
    await cancelRequest(donationData.donation_id);
    setShowConfirm(false);
    window.location.reload();
  };

  const handleRate = () => setShowRatingModal(true);

  return {
    loadingRequest,
    showConfirm,
    setShowConfirm,
    showRatingModal,
    setShowRatingModal,
    handleRequest,
    handleCancel,
    handleRate,
  };
};
