import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/donationnav.css";

const DonationNav = () => {
  const navigate = useNavigate();

  return (
    <div className="donationnav-container">
      <button
        className="donationnav-button"
        onClick={() => navigate("/donations")}
      >
        חזרה לרשימת תרומות
      </button>

      <button
        className="donationnav-button"
        onClick={() => navigate("/adddonation")}
      >
        הוסף תרומה חדשה
      </button>
    </div>
  );
};

export default DonationNav;
