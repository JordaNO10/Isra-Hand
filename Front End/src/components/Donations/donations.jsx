import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Donationadd from "./Donationadd";
import axios from "axios"; // Import axios
import "./css/donations.css";

const Donation = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load donations and categories from the backend on first render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationResponse, categoryResponse] = await Promise.all([
          axios.get("/donations", {
            headers: {
              Accept: "application/json", // Optional, but can help clarify what type of response you expect
            },
          }),
          axios.get("/categories", {
            headers: {
              Accept: "application/json", // Optional, but can help clarify what type of response you expect
            },
          }),
        ]);

        setDonations(donationResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle donation submission
  const addDonation = (newDonation) => {
    setDonations((prevDonations) => [...prevDonations, newDonation]);
  };

  if (loading) return <p>Loading donations...</p>;

  return (
    <section className="donation-section">
      <Donationadd onAddDonation={addDonation} categories={categories} />
      <div className="donation-container">
        <h1>Donations</h1>

        <div className="donation-items">
          {donations.map((item) => (
            <div key={item.donation_id} className="donation-card">
              <h2>Item name: {item.donation_name}</h2>
              <p>Email: {item.email}</p>
              <p>Description: {item.description}</p>
              {item.donat_photo && (
                <div className="donation-image">
                  <img src={item.donat_photo} alt="Donation" />
                </div>
              )}
              <button
                className="donation-button"
                onClick={() => navigate(`/donations/${item.donation_id}`)}
              >
                View {item.donation_name}
              </button>
            </div>
          ))}
        </div>

        {/* Always show this message at the bottom */}
        <p className="no-donations">
          No donations yet. Be the first to contribute!
        </p>
      </div>
    </section>
  );
};

export default Donation;
