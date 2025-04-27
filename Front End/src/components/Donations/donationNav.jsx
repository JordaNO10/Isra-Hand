import React from "react";
import { useDonationNavigation } from "./Helpers/useDonationNavigation";

function DonationNavigation({ donations, currentId, onSelectDonation }) {
  const { selectedId, handleSelectChange, handleBackClick } =
    useDonationNavigation(onSelectDonation);

  return (
    <div className="navigation">
      <button onClick={handleBackClick}>Back To Donations</button>
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
