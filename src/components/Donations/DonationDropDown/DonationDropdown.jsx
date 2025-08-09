/**
 * בחירת תרומה אחרת מתוך רשימה מקובצת לפי קטגוריה.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDonationDropdown } from "../Helpers/useDonationDropdown";
import "../css/dropdown.css";
import SelectDonation from "./SelectDonation";

const DonationDropdown = ({ currentId, onSelectDonation }) => {
  const { groupedDonations, loading, error } = useDonationDropdown(currentId);
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedId(value);
    if (value) { onSelectDonation(value); setSelectedId(""); }
  };

  return (
    <div className="donationdropdown-container">
      <label htmlFor="donation-switch"></label>
      {loading && <p>טוען תרומות...</p>}
      {error && <p>שגיאה: {error}</p>}
      {!loading && !error && (
        <SelectDonation groupedDonations={groupedDonations} value={selectedId} onChange={handleSelectChange} />
      )}
      <button onClick={() => navigate("/donations")} className="donationdropdown-back">חזור</button>
    </div>
  );
};
export default DonationDropdown;
