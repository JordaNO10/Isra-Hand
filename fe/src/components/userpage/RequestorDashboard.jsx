// FILE: RequestorDashboard.jsx (🔄 Connected to useRequestorDashboard)
import React from "react";
import { useRequestorDashboard } from "./Helpers/useRequestorDashboard";
import Cookies from "js-cookie";
import "./css/RequestorDashboard.css";

const RequestorDashboard = () => {
  const {
    availableDonations,
    myRequests,
    loading,
    error,
    requestDonation,
    cancelRequest,
  } = useRequestorDashboard();

  const userEmail = Cookies.get("userEmail");
  const userName = Cookies.get("userName");

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="profile-info-box">
          <h2>פרטים אישיים:</h2>
          <p>
            <strong>אימייל:</strong> {userEmail}
          </p>
          <p>
            <strong>סוג משתמש:</strong> Requestor
          </p>
        </div>
      </div>

      <h1 className="welcome-message">ברוך הבא, {userName} 👋</h1>

      <h2 className="section-title">תרומות זמינות לבקשה:</h2>
      <div className="items-grid">
        {availableDonations.map((donation) => (
          <div key={donation.donation_id} className="item-card">
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="Donation"
                className="item-image-placeholder"
              />
            )}
            <h3>{donation.donation_name}</h3>
            <p>{donation.description}</p>
            <p>{donation.email}</p>
            <button onClick={() => requestDonation(donation.donation_id)}>
              בקש תרומה זו
            </button>
          </div>
        ))}
      </div>

      <h2 className="section-title">הבקשות שלי:</h2>
      <div className="items-grid">
        {myRequests.map((donation) => (
          <div key={donation.donation_id} className="item-card">
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="Donation"
                className="item-image-placeholder"
              />
            )}
            <h3>{donation.donation_name}</h3>
            <p>{donation.description}</p>
            <p>{donation.email}</p>
            <button onClick={() => cancelRequest(donation.donation_id)}>
              בטל בקשה
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestorDashboard;
