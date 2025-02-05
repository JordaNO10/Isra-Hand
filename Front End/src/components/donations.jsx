import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Donationadd from "./Donationadd";
import "../css/donations.css";

const Donation = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);

  // Load donations from the backend on first render
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("/api/donate");
        const data = await response.json();
        setDonations(data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
      }
    };

    fetchDonations();
  }, []);

  // Function to handle donation submission
  const addDonation = (newDonation) => {
    setDonations((prevDonations) => [...prevDonations, newDonation]);
  };

  return (
    <section className="donation-section">
      <Donationadd onAddDonation={addDonation} />

      <div className="donation-container">
        <h1>Donations</h1>

        {donations.length === 0 ? (
          <p className="no-donations">
            No donations yet. Be the first to contribute!
          </p>
        ) : (
          <div className="donation-items">
            {donations.map((item) => (
              <div key={item.id} className="donation-card">
                <h2>{item.name}</h2>
                <p>{item.email}</p>
                <p>{item.description}</p>

                {item.image && (
                  <div className="donation-image">
                    <img src={item.image} alt="Donation" />
                  </div>
                )}

                <button
                  className="donation-button"
                  onClick={() => navigate(`/donations/${item.id}`)}
                >
                  View {item.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Donation;
