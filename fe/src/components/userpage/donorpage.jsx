import React from "react";
import { useDashboardDataHelpers } from "./Helpers/useDashboardDataHelpers";
import { useNavigate } from "react-router-dom";
import "./css/DonorDashboard.css";

const DonorDashboard = () => {
  const { userData, donations, loading, error } = useDashboardDataHelpers();
  const navigate = useNavigate();

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  return (
    <div className="dashboard-container">
      {/* Welcome and Profile Section */}
      <div className="dashboard-header">
        <div className="upload-button-container">
          <button
            className="upload-donation-btn"
            onClick={() => navigate("/Donationadd")}
          >
            העלאת תרומה
          </button>
        </div>

        <div className="profile-info-box">
          <h2>פרטים אישיים:</h2>
          <p>
            <strong>אימייל:</strong> {userData.email}
          </p>
          <p>
            <strong>סוג משתמש:</strong> Donor
          </p>
        </div>
      </div>

      {/* Welcome Message */}
      <h1 className="welcome-message">ברוך הבא, {userData.full_name} 👋</h1>

      {/* Donations Section */}
      <h2 className="section-title">התרומות שלי:</h2>
      <div className="items-grid">
        {donations.map((donation) => (
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
    </div>
  );
};

export default DonorDashboard;
