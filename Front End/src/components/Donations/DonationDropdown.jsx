import React, { useEffect, useState } from "react";
import "./css/dropdown.css";
import axios from "axios";

function DonationDropdown({ currentId = "", onSelectDonation }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Current ID:", currentId); // Debugging log

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("/donations");
        setDonations(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

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

        {/* Group donations by category name */}
        {Object.entries(
          donations.reduce((acc, donation) => {
            if (!acc[donation.category_name]) {
              acc[donation.category_name] = [];
            }
            acc[donation.category_name].push(donation);
            return acc;
          }, {})
        ).map(([category, categoryDonations]) => (
          <optgroup key={category} label={category}>
            {categoryDonations
              .filter(
                (item) => item.donation_id.toString() !== currentId.toString()
              )
              .map((item) => (
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
