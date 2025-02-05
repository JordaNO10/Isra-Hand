import React from "react";
import "../css/dropdown.css";

function DonationDropdown({ donations, currentId, onSelectDonation }) {
  return (
    <div>
      <select
        className="donation-dropdown"
        onChange={(e) => onSelectDonation(e.target.value)}
      >
        <option value="">בחר תרומה</option>
        {donations
          .filter((donation) => donation.id.toString() !== currentId) // Exclude the current donation
          .map((donation) => (
            <option key={donation.id} value={donation.id}>
              {donation.name}
            </option>
          ))}
      </select>
    </div>
  );
}

export default DonationDropdown;
