import React from "react";
import { useDashboardDataHelpers } from "./Helpers/useDashboardDataHelpers";
import "./css/RequestorDashboard.css";

const RequestorDashboard = () => {
  const { userData, donations, loading, error } = useDashboardDataHelpers();

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  return (
    <div className="dashboard-container">
      <h1 className="welcome-message">ברוך הבא, {userData.username}!</h1>

      <div className="profile-info-box">
        <h2>פרטים אישיים:</h2>
        <p>
          <strong>שם מלא :</strong> {userData.full_name}
        </p>
        <p>
          <strong>אימייל :</strong> {userData.email}
        </p>
      </div>

      <h2 className="section-title">פריטים שהתעניינתי בהם:</h2>

      <div className="items-grid">
        {donations.map((donation) => (
          <div key={donation.donation_id} className="item-card">
            <div className="item-image-placeholder">תמונה</div>
            <h3>{donation.donation_name}</h3>
            <p>תיאור: {donation.description}</p>
            <p>אימייל: {donation.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestorDashboard;
