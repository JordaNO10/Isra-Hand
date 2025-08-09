/**
 * לוח מבקש (RequestorDashboard)
 * - מציג פרטי פרופיל
 * - "הבקשות שלי" + "תרומות שקיבלתי"
 * - פתיחת המודל Singlepage מכל כרטיס/שורה
 * - סימון תרומה כ"נתקבלה" ופתיחת חלון דירוג
 */
import "../css/RequestorDashboard.css"

import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// עזרי דאטה/מצבים
import { useRequestorDashboard } from "../Helpers/useRequestorDashboard";
import { useDashboardDataHelpers } from "../Helpers/useDashboardDataHelpers";
import { useEditUser } from "../Helpers/userEditUser";

// קומפוננטות משנה
import ProfileInfoBox from "./ProfileInfoBox";
import RequestsGrid from "./RequestsGrid";
import AcceptedGrid from "./AcceptedGrid";
import RatingModal from "../Rating/RatingModal";
import UserEditModal from "../Modals/UserEditModal";
import Singlepage from "../../Donations/Singlepage/singlePage";

// ===== קומפוננטות קטנות =====

/** מודל Singlepage כללי לשימוש חוזר */
const SinglepageModal = ({ open, donationId, onClose }) => {
  if (!open || !donationId) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>✖</button>
        <Singlepage donationId={donationId} />
      </div>
    </div>
  );
};

// ===== קומפוננטה ראשית =====

const RequestorDashboard = () => {
  const navigate = useNavigate();
  const {
    userData,
    setUserData,
    unacceptedRequests,
    acceptedDonations,
    loading,
    error,
    cancelRequest,
    markAsAccepted,
  } = useRequestorDashboard();

  const { formatLastLogin } = useDashboardDataHelpers();
  const { editedUser, handleFieldChange } = useEditUser(userData, setUserData);

  // מצב מודלים
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingDonation, setRatingDonation] = useState(null);
  const [editingUserModal, setEditingUserModal] = useState(false);

  // מודל Singlepage
  const [showSinglepage, setShowSinglepage] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);
  const openSinglepage = (id) => { setSelectedDonationId(id); setShowSinglepage(true); };
  const closeSinglepage = () => { setShowSinglepage(false); setSelectedDonationId(null); };

  const userId = Cookies.get("userId");

  /** אישור קבלת תרומה → עדכון סטטוס + פתיחת דירוג */
  const handleAccept = async (donation) => {
    await markAsAccepted(donation.donation_id);
    setRatingDonation(donation);
    setShowRatingModal(true);
  };

  /** שמירת שינויים בפרטי המשתמש (שדות שעודכנו בלבד) */
  const saveUserChanges = async () => {
    try {
      const fields = Object.keys(editedUser || {});
      for (const f of fields) {
        await axios.put(`/users/${userData.user_id}`, { [f]: editedUser[f] });
        setUserData((prev) => ({ ...prev, [f]: editedUser[f] }));
      }
      setEditingUserModal(false);
    } catch (err) {
      alert("שגיאה בשמירה: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error)   return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  return (
    <div className="dashboard-container">
      {/* פרופיל */}
      <div className="dashboard-header">
        <ProfileInfoBox
          user={userData}
          lastLogin={formatLastLogin(userData?.last_login)}
          onEdit={() => setEditingUserModal(true)}
        />
      </div>

      <h1 className="welcome-message">ברוך הבא, {userData?.full_name} 👋</h1>

      {/* קיצור לדף התרומות */}
      <h2 className="section-title">לבקשת תרומה חדשה:</h2>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button className="show-more-btn" onClick={() => navigate("/donations")}>
          עבור לדף התרומות הזמינות
        </button>
      </div>

      {/* הבקשות שלי */}
      <h2 className="section-title">הבקשות שלי:</h2>
      <RequestsGrid
        items={unacceptedRequests}
        onCancel={(id) => cancelRequest(id)}
        onAccept={(donation) => handleAccept(donation)}
        onOpen={(id) => openSinglepage(id)}
      />

      {/* תרומות שקיבלתי */}
      <h2 className="section-title">תרומות שקיבלת:</h2>
      <AcceptedGrid
        items={acceptedDonations}
        onOpen={(id) => openSinglepage(id)}
        onRate={(donation) => handleAccept(donation)}
      />

      {/* מודל דירוג */}
      {showRatingModal && ratingDonation && (
        <RatingModal
          donationId={ratingDonation.donation_id}
          requestorId={userId}
          onClose={() => { setShowRatingModal(false); setRatingDonation(null); }}
        />
      )}

      {/* מודל עריכת משתמש */}
      {editingUserModal && (
        <UserEditModal
          user={userData}
          formValues={{ ...userData, ...editedUser }}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          onSave={saveUserChanges}
          onCancel={() => setEditingUserModal(false)}
        />
      )}

      {/* מודל Singlepage אחיד */}
      <SinglepageModal
        open={showSinglepage}
        donationId={selectedDonationId}
        onClose={closeSinglepage}
      />
    </div>
  );
};

export default RequestorDashboard;
