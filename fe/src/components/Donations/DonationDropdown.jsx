import React from "react";
import "./css/dropdown.css";
import {
  useDonationDropdown,
  useDonationNavigation,
} from "./Helpers/useDonationDropdown";

const DonationDropdown = ({ currentId, onSelectDonation }) => {
  const { groupedDonations, loading, error } = useDonationDropdown(currentId);
  const { selectedId, handleSelectChange, handleBackClick } =
    useDonationNavigation(onSelectDonation);

  return (
    <div className="donationdropdown-container">
      <label htmlFor="donation-switch">בחר תרומה אחרת:</label>
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
          {Object.entries(groupedDonations).map(([category, items]) => (
            <optgroup key={category} label={category}>
              {items.map((donation) => (
                <option key={donation.donation_id} value={donation.donation_id}>
                  {donation.donation_name}
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
