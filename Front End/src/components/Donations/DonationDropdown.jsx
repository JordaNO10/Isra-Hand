import React from "react";
import "./css/dropdown.css";

function DonationDropdown({ donations, currentId, onSelectDonation }) {
  return (
    <div>
      <label htmlFor="donation-select" className="dropdown-label">
        בחר תרומה
      </label>
      <select
        id="donation-select" // Added an ID for better accessibility
        className="donation-dropdown"
        onChange={(e) => onSelectDonation(e.target.value)}
        defaultValue="" // Set default value for controlled component
      >
        <option value="" disabled>
          בחר תרומה
        </option>{" "}
        {/* Placeholder option */}
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
