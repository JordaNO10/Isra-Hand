import React from "react";
import { useNavigate } from "react-router-dom";

function DonationNavigation({ donations, currentId, onSelectDonation }) {
  const navigate = useNavigate();

  return (
    <div className="navigation">
      <button onClick={() => navigate("/donations")}>Back To Donations</button>
      <select onChange={onSelectDonation}>
        <option value="" disabled>
          Select Another Donation
        </option>
        {donations.map(
          (donation) =>
            donation.id.toString() !== currentId && (
              <option key={donation.id} value={donation.id}>
                {donation.name}
              </option>
            )
        )}
      </select>
    </div>
  );
}

export default DonationNavigation;
