import { useState } from "react";
import { useRequestorDashboard } from "./Helpers/useRequestorDashboard";
import { useEditUser } from "./Helpers/userEditUser";
import RatingModal from "./RatingModal";
import "./css/RequestorDashboard.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import UserEditModal from "./UserEditModal";
import axios from "axios";
import { useDashboardDataHelpers } from "./Helpers/useDashboardDataHelpers";

const userId = Cookies.get("userId");

const RequestorDashboard = () => {
  const [isRequesting, setIsRequesting] = useState(false);
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

  const navigate = useNavigate();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const { editedUser, handleFieldChange } = useEditUser(userData, setUserData);
  const [editingUserModal, setEditingUserModal] = useState(false);

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;

  const handleAccept = async (donation) => {
    await markAsAccepted(donation.donation_id);
    setSelectedDonation(donation);
    setShowRatingModal(true);
  };

  return (
    <div className="dashboard-container">
      {isRequesting && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>שולח בקשה...</p>
        </div>
      )}

      <div className="dashboard-header">
        <div className="profile-info-box">
          <h2>פרטים אישיים:</h2>
          <p>
            <strong>שם מלא:</strong> {userData.full_name}
          </p>
          <p>
            <strong>אימייל:</strong> {userData.email}
          </p>
          <p>
            <strong>תאריך לידה:</strong> {userData.birth_date}
          </p>
          <p>
            <strong>טלפון:</strong> {userData.phone_number}
          </p>
          <p>
            <strong>כתובת:</strong> {userData.address}
          </p>
          <p>
            <strong>סוג משתמש:</strong> מבקש תרומה
          </p>
          <p>התחברות אחרונה: {formatLastLogin(userData?.last_login)}</p>

          <button onClick={() => setEditingUserModal(true)}>
            ✏️ ערוך פרופיל
          </button>
        </div>
      </div>

      <h1 className="welcome-message">ברוך הבא, {userData?.full_name} 👋</h1>

      {/* ✅ Button to view available donations */}
      <h2 className="section-title">לבקשת תרומה חדשה:</h2>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          className="show-more-btn"
          onClick={() => navigate("/donations")}
        >
          עבור לדף התרומות הזמינות
        </button>
      </div>

      <h2 className="section-title">הבקשות שלי:</h2>
      <div className="items-grid">
        {unacceptedRequests.map((donation) => (
          <div key={donation.donation_id} className="item-card">
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="Donation"
                className="item-image-placeholder"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/donations/${donation.donation_id}`)}
              />
            )}
            <h3>{donation.donation_name}</h3>
            <p>{donation.description}</p>
            <p>{donation.email}</p>
            <div className="request-buttons">
              <button onClick={() => cancelRequest(donation.donation_id)}>
                בטל בקשה
              </button>
              <button onClick={() => handleAccept(donation)}>
                מאשר קבלת תרומה
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">תרומות שקיבלת:</h2>
      <div className="items-grid">
        {acceptedDonations.map((donation) => (
          <div key={donation.donation_id} className="item-card">
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="Donation"
                className="item-image-placeholder"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/donations/${donation.donation_id}`)}
              />
            )}
            <h3>{donation.donation_name}</h3>
            <p>{donation.description}</p>
            <p>{donation.email}</p>

            {donation.rating_user_id == null && (
              <button onClick={() => handleAccept(donation)}>
                דרג את התרומה
              </button>
            )}
          </div>
        ))}
      </div>

      {showRatingModal && selectedDonation && (
        <RatingModal
          donation={selectedDonation}
          donationId={selectedDonation.donation_id}
          requestorId={userId}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedDonation(null);
          }}
        />
      )}

      {editingUserModal && (
        <UserEditModal
          user={userData}
          formValues={{ ...userData, ...editedUser }}
          onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
          onSave={async () => {
            try {
              const fields = Object.keys(editedUser);
              for (let field of fields) {
                await axios.put(`/users/${userData.user_id}`, {
                  [field]: editedUser[field],
                });
                setUserData((prev) => ({
                  ...prev,
                  [field]: editedUser[field],
                }));
              }
              setEditingUserModal(false);
            } catch (err) {
              alert(
                "שגיאה בשמירה: " + (err.response?.data?.error || err.message)
              );
            }
          }}
          onCancel={() => setEditingUserModal(false)}
        />
      )}
    </div>
  );
};

export default RequestorDashboard;
