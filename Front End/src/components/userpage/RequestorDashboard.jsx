// src/pages/RequestorDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RequestorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available donations
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/donations");
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="requestor-dashboard">
      <h1>Welcome, Requestor!</h1>
      <h2>Available Donations:</h2>
      <ul>
        {donations.map((donation) => (
          <li key={donation.donation_id}>
            {donation.title} - {donation.description}
          </li>
        ))}
      </ul>
      <button onClick={() => alert("Request functionality coming soon!")}>
        Request a Donation
      </button>
    </div>
  );
};

export default RequestorDashboard;
