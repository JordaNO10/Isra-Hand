// FILE: Donations.jsx (📋 Role-aware donation list view)
import React from "react";
import { useDonationsPage } from "./Helpers/useDonationsPage";
import { useNavigate } from "react-router-dom";
import "./css/donations.css";

const Donations = () => {
  const navigate = useNavigate();
  const { donations, loading, userRole } = useDonationsPage();

  if (loading) return <div>Loading donations...</div>;

  return (
    <section className="donations-section">
      <h2>רשימת תרומות</h2>
      <div className="donations-list">
        {donations.length === 0 && <p>אין תרומות להצגה.</p>}
        {donations.map((donation) => (
          <div
            key={donation.donation_id}
            className="donation-card"
            onClick={() => navigate(`/donations/${donation.donation_id}`)}
          >
            <h3>{donation.donation_name}</h3>
            <p>{donation.description}</p>
            <p>
              <strong>קטגוריה:</strong> {donation.category_name || ""}
            </p>
            {donation.donat_photo && (
              <img
                src={donation.donat_photo}
                alt="donation preview"
                className="donation-card-img"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Donations;
