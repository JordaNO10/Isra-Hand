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
  const [error, setError] = useState(null);

  // Load donations and categories from the backend on first render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationResponse, categoryResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/donate"),
          axios.get("http://localhost:5000/api/categories"),
        ]);

        console.log("Donations:", donationResponse.data); // Log donations
        console.log("Categories:", categoryResponse.data); // Log categories

        setDonations(donationResponse.data);
        setCategories(categoryResponse.data);
      } catch (error) {
        setError(error.response?.data?.error || error.message); // Use error response from Axios
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchData();
  }, []);

  // Function to handle donation submission
  const addDonation = (newDonation) => {
    setDonations((prevDonations) => [...prevDonations, newDonation]);
  };

  if (loading) return <p>Loading donations...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="donation-section">
      <Donationadd onAddDonation={addDonation} categories={categories} />
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
