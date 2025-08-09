/**
 * הוק לניהול לוגיקת בקשת תרומה, ביטול בקשה ודירוג.
 * שומר מצבים רלוונטיים ומחזיר פונקציות לטיפול בפעולות.
 */
import { useState } from "react";

export const useRequestFlow = (donationData, requestDonation, cancelRequest) => {
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  // שליחת בקשה
  const handleRequest = async () => {
    if (!donationData) return;
    setLoadingRequest(true);
    try {
      await requestDonation(donationData.donation_id);
      setTimeout(() => window.location.reload(), 800);
    } catch {
      setLoadingRequest(false);
    }
  };

  // ביטול בקשה
  const handleCancel = async () => {
    if (!donationData) return;
    await cancelRequest(donationData.donation_id);
    setShowConfirm(false);
    window.location.reload();
  };

  // פתיחת חלון דירוג
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
