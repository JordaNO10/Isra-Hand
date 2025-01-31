import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Donationadd from "./Donationadd";
import "../css/style.css"; // Ensure to import your styles
import "../css/donations.css"

const Donation = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);

  const handleButtonClick = (id) => {
    navigate(`/donations/${id}`);
  };

  const addDonation = (newDonation) => {
    setDonations((prevDonations) => {
      const updatedDonations = [...prevDonations, newDonation];
      localStorage.setItem("donations", JSON.stringify(updatedDonations));
      return updatedDonations;
    });
  };

  useEffect(() => {
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
