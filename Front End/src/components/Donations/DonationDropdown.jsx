import React from "react";
import "./css/dropdown.css";
import { useDonationDropdown } from "./Helpers/useDonationDropdown";

function DonationDropdown({ currentId = "", onSelectDonation }) {
  const { loading, error, groupedDonations } = useDonationDropdown(currentId);

  if (loading) return <div>Loading donations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <label htmlFor="donation-select" className="dropdown-label">
        בחר תרומה
      </label>
      <select
        id="donation-select"
        className="donation-dropdown"
        onChange={(e) => onSelectDonation(e.target.value)}
        defaultValue=""
      >
        <option value="" disabled>
          בחר תרומה
        </option>

        {Object.entries(groupedDonations).map(([category, items]) => (
          <optgroup key={category} label={category}>
            {items.map((item) => (
              <option key={item.donation_id} value={item.donation_id}>
                {item.donation_name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export default DonationDropdown;
