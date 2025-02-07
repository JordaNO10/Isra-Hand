import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DonationNavigation({ donations, currentId, onSelectDonation }) {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(""); // State to manage the selected donation ID

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedId(value); // Update the selected ID state

    if (value) {
      onSelectDonation(value); // Call the onSelectDonation function with the selected ID
      setSelectedId(""); // Reset the dropdown value
    }
  };

  return (
    <div className="navigation">
      <button onClick={() => navigate("/donations")}>Back To Donations</button>
      {donations.length > 0 && (
        <select value={selectedId} onChange={handleSelectChange}>
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
      )}
    </div>
  );
}

export default DonationNavigation;
