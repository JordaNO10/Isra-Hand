/**
 * תפקיד המחלקה: לרכז בתוך לשוניות את פעולות התורם (התרומות שלי, בקשות שהתקבלו)
 *                ואת פעולות המבקש (הבקשות שלי, תרומות שקיבלתי + דירוג),
 *                כולל פתיחת Singlepage מכל מקום ומודלים לפי צורך.
 */

import "../css/UnifiedDashboard.css"

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import { useDashboardDataHelpers } from "../Helpers/useDashboardDataHelpers";
import { useDonorRating } from "../Helpers/useDonorRating";
import { useEditUser } from "../Helpers/userEditUser";
import { useRequestorDashboard } from "../Helpers/useRequestorDashboard";

import ProfileInfoBox from "./ProfileInfoBox";
import MyDonationsGrid from "./MyDonationsGrid";
import RequestedBySection from "./RequestedBySection";
import RequestsGrid from "./RequestsGrid";
import AcceptedGrid from "./AcceptedGrid";
import RatingModal from "../Rating/RatingModal";
import UserEditModal from "../Modals/UserEditModal";
import DonationAdd from "../../Donations/DonationAdd/DonationAdd";
import Singlepage from "../../Donations/Singlepage/singlePage";

// ----- תתי־קומפוננטות קטנות -----

const Tabs = ({ tab, onTab }) => (
  <div className="tabs">
    <button
      className={tab === "donor" ? "tab active" : "tab"}
      onClick={() => onTab("donor")}
    >
      התרומות שלי
    </button>
    <button
      className={tab === "requestor" ? "tab active" : "tab"}
      onClick={() => onTab("requestor")}
    >
      הבקשות שלי
    </button>
  </div>
);

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


const UnifiedDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const { userData, setUserData, formatLastLogin, donations, loading, error } =
    useDashboardDataHelpers();

  const { editedUser, handleFieldChange } = useEditUser(userData, setUserData);

  const { rating, loading: ratingLoading, error: ratingError } = useDonorRating();

  const {
    unacceptedRequests,
    acceptedDonations,
    cancelRequest,
    markAsAccepted,
  } = useRequestorDashboard();

  // מצב לשוניות/מודלים
  const [tab, setTab] = useState(() => localStorage.getItem("ud_tab") || "donor");
  const [showAddDonation, setShowAddDonation] = useState(false);
  const [editingUserModal, setEditingUserModal] = useState(false);
  const [showSinglepage, setShowSinglepage] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  // דירוג לאחר "סימון כנתקבלה"
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingDonation, setRatingDonation] = useState(null);

  // בקשות שהתקבלו לתרומות שלי (חלק לוח תורם)
  const [requested, setRequested] = useState([]);

  /** שינוי לשונית + זכירה בלוקאל סטורג' */
  const onTab = useCallback((t) => {
    setTab(t);
    localStorage.setItem("ud_tab", t);
  }, []);

  const openSinglepage = (id) => { setSelectedDonationId(id); setShowSinglepage(true); };
  const closeSinglepage = () => { setShowSinglepage(false); setSelectedDonationId(null); };

  useEffect(() => {
    if (location.state?.setShowModal) {
      setShowAddDonation(true);
      window.history.replaceState({}, document.title);
      onTab("donor");
    }
  }, [location.state, onTab]);

  useEffect(() => {
    const focusId = params.get("focus");
    if (focusId) {
      navigate("/dashboard", { replace: true });
      openSinglepage(Number(focusId));
    }
  }, [params, navigate]);

  useEffect(() => {
    if (!userData?.user_id) return;
    axios
      .get(`/donations/requested-by-requestors/${userData.user_id}`, { withCredentials: true })
      .then((res) => setRequested(res.data))
      .catch((err) => console.error("❌ Failed to fetch requested donations", err));
  }, [userData]);

  const saveUserChanges = async () => {
    try {
      const fields = Object.keys(editedUser || {});
      for (const f of fields) {
        await axios.put(`/users/${userData.user_id}`, { [f]: editedUser[f] }, { withCredentials: true });
        setUserData((prev) => ({ ...prev, [f]: editedUser[f] }));
      }
      setEditingUserModal(false);
    } catch (err) {
      alert("שגיאה בשמירה: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAccept = async (donation) => {
    await markAsAccepted(donation.donation_id);
    setRatingDonation(donation);
    setShowRatingModal(true);
  };

  if (loading)   return <div className="dashboard">טוען נתונים...</div>;
  if (error)     return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  const myDonations = donations.filter((d) => d.user_id === userData.user_id);
  const fullName = userData.full_name || Cookies.get("fullName") || "";

  return (
    <div className="dashboard-container">
      <h1 className="welcome-message">ברוך הבא, {fullName} 👋</h1>

      <div className="dashboard-body">
        {/* סיידבר פרופיל יחיד לשני המצבים */}
        <div className="dashboard-sidebar">
          <ProfileInfoBox
            user={userData}
            lastLogin={formatLastLogin(userData?.last_login)}
            ratingState={{ rating, ratingLoading, ratingError }}
            onEdit={() => setEditingUserModal(true)}
          />
        </div>

        <div className="dashboard-main">
          <Tabs tab={tab} onTab={onTab} />

          {tab === "donor" ? (
            <>
              <MyDonationsGrid
                items={myDonations}
                onAdd={() => setShowAddDonation(true)}
                onOpen={(id) => openSinglepage(id)}
              />

              <RequestedBySection
                items={requested}
                onOpen={(id) => openSinglepage(id)}
              />
            </>
          ) : (
            <>
              <h2 className="section-title">לבקשת תרומה חדשה:</h2>
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <button className="show-more-btn" onClick={() => navigate("/donations")}>
                  עבור לדף התרומות הזמינות
                </button>
              </div>

              <h2 className="section-title">הבקשות שלי:</h2>
              <RequestsGrid
                items={unacceptedRequests}
                onCancel={(id) => cancelRequest(id)}
                onAccept={(donation) => handleAccept(donation)}
                onOpen={(id) => openSinglepage(id)}
              />

              <h2 className="section-title">תרומות שקיבלת:</h2>
              <AcceptedGrid
                items={acceptedDonations}
                onOpen={(id) => openSinglepage(id)}
                onRate={(donation) => handleAccept(donation)}
              />
            </>
          )}
        </div>
      </div>

      {showAddDonation && (
        <DonationAdd onClose={() => setShowAddDonation(false)} userData={userData} />
      )}

      {editingUserModal && (
        <UserEditModal
          user={userData}
          formValues={{ ...userData, ...editedUser }}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          onSave={saveUserChanges}
          onCancel={() => setEditingUserModal(false)}
        />
      )}

      <SinglepageModal
        open={showSinglepage}
        donationId={selectedDonationId}
        onClose={closeSinglepage}
      />

      {showRatingModal && ratingDonation && (
        <RatingModal
          donationId={ratingDonation.donation_id}
          requestorId={Cookies.get("userId")}
          onClose={() => { setShowRatingModal(false); setRatingDonation(null); }}
        />
      )}
    </div>
  );
};

export default UnifiedDashboard;
