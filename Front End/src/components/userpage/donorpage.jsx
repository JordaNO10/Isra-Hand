import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./css/DonorDashboard.css";

const DonorDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = Cookies.get("userId");
      if (!userId) {
        setError("User ID not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/users/${userId}`, {
          withCredentials: true,
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData && userData.role_id === 1) {
      // 1 = Admin role ID — adjust to match your DB
      navigate("/admin");
    }
  }, [userData, navigate]);

  if (loading) return <div className="dashboard">טוען נתונים...</div>;
  if (error) return <div className="dashboard error">{error}</div>;
  if (!userData) return <div className="dashboard error">משתמש לא נמצא</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome, {userData.full_name} 👋</h1>
      <p className="dashboard-subtext">What would you like to do today?</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Add a New Donation</h3>
          <p>Create a new donation listing</p>
          <button onClick={() => navigate("/add-donation")}>
            Add Donation
          </button>
        </div>

        <div className="dashboard-card">
          <h3>My Donations</h3>
          <p>View and manage your past donations</p>
          <button onClick={() => navigate("/my-donations")}>
            View Donations
          </button>
        </div>

        <div className="dashboard-card">
          <h3>Donation Statistics</h3>
          <p>See how many people you’ve helped ❤️</p>
          <button onClick={() => navigate("/donation-stats")}>
            View Stats
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
