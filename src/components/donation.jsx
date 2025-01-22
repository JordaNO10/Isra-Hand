import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Donationadd from "./Donationadd";

const Donation = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);

  // Handle button click to navigate to the SinglePage
  const handleButtonClick = (id) => {
    navigate(`/donation/${id}`);
  };

  // Add donation to the donations state and localStorage
  const addDonation = (newDonation) => {
    setDonations((prevDonations) => {
      const updatedDonations = [...prevDonations, newDonation];

      // Save the new donation to localStorage
      localStorage.setItem("donations", JSON.stringify(updatedDonations));

      return updatedDonations; // Update the state with the new donations
    });
  };

  useEffect(() => {
    // Load saved donations from localStorage when the component mounts
    const savedDonations = JSON.parse(localStorage.getItem("donations")) || [];
    setDonations(savedDonations);
  }, []);

  return (
    <section className="main">
      <Donationadd onAddDonation={addDonation} />
      <div className="donation-container">
        <h1>Donations</h1>
        <div className="donation-items">
          {donations.map((item) => (
            <div key={item.id} className="donation-item">
              <h2>Donation name: {item.name}</h2>
              <p>Donor Email: {item.email}</p>
              <p>Donation Description: {item.description}</p>
              {item.image && (
                <div>
                  <h3>Donation Image:</h3>
                  <div className="donation-image">
                    <img
                      src={item.image}
                      alt="Donation"
                      style={{ maxWidth: "10vw" }}
                    />
                  </div>
                </div>
              )}
              <button
                className="donation-button"
                onClick={() => handleButtonClick(item.id)}
              >
                Go to {item.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Donation;
