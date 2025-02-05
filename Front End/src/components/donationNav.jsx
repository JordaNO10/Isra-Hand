import React from "react";
import { useNavigate } from "react-router-dom";

function DonationNavigation({ donations, currentId, onSelectDonation }) {
  const navigate = useNavigate();

  return (
    <div className="navigation">
      <button onClick={() => navigate("/donations")}>Back To Donations</button>
      {donations.length > 0 && (
        <select
          onChange={(e) => {
            const selectedId = e.target.value;
            if (selectedId) {
              onSelectDonation(selectedId); // Call the onSelectDonation function with the selected ID
              e.target.value = ""; // Reset the dropdown value
            }
          }}
        >
          <option value="" disabled selected>
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
      )}
    </div>
  );
}

export default DonationNavigation;
