import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardDataHelpers } from "./Helpers/useDashboardDataHelpers";
import DonationAdd from "../Donations/Donationadd"; // Adjust path if needed
import "./css/DonorDashboard.css";

const DonorDashboard = () => {
  const { userData, donations, loading, error } = useDashboardDataHelpers();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  const myDonations = donations.filter(
    (donation) => donation.user_id === userData.user_id
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <h1 className="welcome-message">ברוך הבא, {userData.full_name} 👋</h1>

      {/* Content wrapper with 2 columns: Main + Sidebar */}
      <div className="dashboard-body">
        {/* Main Content */}
        <div className="dashboard-main">
          <div className="dashboard-sidebar">
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

          {/* Title + Upload Button if there are donations */}
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

          {/* No Donations Message */}
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

      {/* Modal */}
      {showModal && (
        <DonationAdd onClose={() => setShowModal(false)} userData={userData} />
      )}
    </div>
  );
};

export default DonorDashboard;
