import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDonationDropdown } from "./Helpers/useDonationDropdown";
import "./css/dropdown.css";

const DonationDropdown = ({ currentId, onSelectDonation }) => {
  const { groupedDonations, loading, error } = useDonationDropdown(currentId);
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedId(value);
    if (value) {
      onSelectDonation(value);
      setSelectedId(""); // optional reset
    }
  };

  const handleBackClick = () => {
    navigate("/donations");
  };

  return (
    <div className="donationdropdown-container">
      <label htmlFor="donation-switch"></label>
      {loading && <p>טוען תרומות...</p>}
      {error && <p>שגיאה: {error}</p>}
      {!loading && !error && (
        <select
          value={selectedId}
          onChange={handleSelectChange}
          className="donationdropdown-select"
        >
          <option value="" disabled>
            בחר תרומה
          </option>
          {Object.entries(groupedDonations).map(([categoryId, data]) => (
            <optgroup key={categoryId} label={data.category_name}>
              {data.subCategories.map((sub, index) => (
                <option key={`${categoryId}-${index}`} value={sub}>
                  {sub}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      )}
      <button onClick={handleBackClick} className="donationdropdown-back">
        חזור
      </button>
    </div>
  );
};

export default DonationDropdown;
