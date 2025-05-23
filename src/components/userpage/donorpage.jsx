import React, { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDashboardDataHelpers } from "./Helpers/useDashboardDataHelpers";
import { useEditUser } from "./Helpers/userEditUser";
import DonationAdd from "../Donations/Donationadd";
import "./css/DonorDashboard.css";

const DonorDashboard = () => {
  const { userData, setUserData, donations, loading, error } =
    useDashboardDataHelpers();
  const { editMode, editedUser, toggleEditMode, handleFieldChange, saveField } =
    useEditUser(userData, setUserData);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.state?.setShowModal) {
      setShowModal(true);
       window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  const myDonations = donations.filter(
    (donation) => donation.user_id === userData.user_id
  );

  const formatPhoneForDisplay = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  };

  const renderEditableField = (label, fieldKey, type = "text") => (
    <p>
      <strong>{label}:</strong>{" "}
      {editMode[fieldKey] ? (
        <>
          <input
            type={type}
            inputMode={fieldKey === "phone_number" ? "numeric" : "text"}
            placeholder={fieldKey === "phone_number" ? "050-1234567" : ""}
            value={
              fieldKey === "phone_number"
                ? formatPhoneForDisplay(
                    editedUser[fieldKey] ?? userData?.[fieldKey] ?? ""
                  )
                : editedUser[fieldKey] ?? userData?.[fieldKey] ?? ""
            }
            onChange={(e) => {
              let val = e.target.value;
              if (fieldKey === "phone_number") {
                val = val.replace(/\D/g, "");
                if (val.length > 10) return;
              }
              handleFieldChange(fieldKey, val);
            }}
          />
          <button className="save-button" onClick={() => saveField(fieldKey)}>
            ✅
          </button>
        </>
      ) : (
        <>
          {fieldKey === "phone_number"
            ? (userData?.[fieldKey] || "").replace(/(\d{3})(\d{7})/, "$1-$2")
            : userData?.[fieldKey] || "—"}{" "}
          <button
            className="edit-icon-button"
            onClick={() => toggleEditMode(fieldKey, true)}
            title="ערוך"
          >
            ✏️
          </button>
        </>
      )}
    </p>
  );

  return (
    <div className="dashboard-container">
      <h1 className="welcome-message">ברוך הבא, {userData.full_name} 👋</h1>

      <div className="dashboard-body">
        <div className="dashboard-main">
          <div className="dashboard-sidebar">
            <div className="profile-info-box">
              <h2>פרטים אישיים:</h2>
              {renderEditableField("שם מלא", "full_name")}
              {renderEditableField("אימייל", "email")}
              {renderEditableField("תאריך לידה", "birth_date", "date")}
              {renderEditableField("טלפון", "phone_number")}
              {renderEditableField("כתובת", "address")}
              <p>
                <strong>סוג משתמש:</strong> תורם
              </p>
              <p> התחברות אחרונה : {userData.last_login}</p>
            </div>
          </div>

          {myDonations.length > 0 && (
            <div className="donations-header">
              <h2 className="section-title">התרומות שלי:</h2>
              <button
                className="upload-donation-btn"
                onClick={() => setShowModal(true)}
              >
                העלאת תרומה
              </button>
            </div>
          )}

          {myDonations.length === 0 ? (
            <div className="no-donations-message">
              <p>עדיין לא העלית תרומות. התחל לעזור לאחרים כבר עכשיו!</p>
              <button
                className="upload-donation-btn"
                onClick={() => setShowModal(true)}
              >
                העלאת תרומה ראשונה
              </button>
            </div>
          ) : (
            <div className="items-grid">
              {myDonations.map((donation) => (
                <div
                  key={donation.donation_id}
                  className="item-card"
                  onClick={() => navigate(`/donations/${donation.donation_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {donation.donat_photo ? (
                    <img
                      src={donation.donat_photo}
                      alt="Donation"
                      className="item-image-placeholder"
                    />
                  ) : (
                    <div className="item-image-placeholder">אין תמונה</div>
                  )}
                  <h3>{donation.donation_name}</h3>
                  <p>{donation.description}</p>
                  <p>{donation.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <DonationAdd onClose={() => setShowModal(false)} userData={userData} />
      )}
    </div>
  );
};

export default DonorDashboard;
