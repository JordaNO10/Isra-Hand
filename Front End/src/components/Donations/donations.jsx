import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Donationadd from "./Donationadd";
import axios from "axios"; // Import axios
import "./css/donations.css";

const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load donations from the backend on first render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/donations", {
          headers: {
            Accept: "application/json",
          },
        });
        setDonations(response.data);
      } catch (error) {
        console.error("Failed to fetch donations:", error);
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
      <div className="donation-container">
        <h1>Donations</h1>

        <div className="donation-items">
          {donations.map((item) => (
            <div key={item.donation_id} className="donation-card">
              <h2>שם התרומה : {item.donation_name}</h2>
              <p>{item.email} אימייל :</p>
              <p>{item.description}תיאור התרומה :</p>
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
טרם הכנסת תרומה לאתר באפשרותך לייצר תרומה בלחיצה על הכפתור הבא        </p>
        <button onClick={() => navigate("/donationadd")}>העלאת תרומה</button>
      </div>
    </section>
  );
};

export default Donations;
