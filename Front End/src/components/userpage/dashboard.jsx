import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./css/dashboard.css";

const UserDashboard = ({ onLogout }) => {
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
        const response = await axios.get(`/users/${userId}`);
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
    if (userData) {
      // Redirect admin users
      if (userData.role_id === "adminRoleId") {
        navigate("/admin");
      }
    }
  }, [userData, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!userData) {
    return <div>User not found.</div>;
  }
  return (
    <div className="dashboard">
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>
      <p>Role: {userData.role_name}</p>
      <div className="actions">
        <h2>Your Actions</h2>

        {userData.role_id === 2 && (
          <button onClick={() => navigate("/donations")}>
            צפייה בתרומות שלי
          </button>
        )}
        {userData.role_id === 3 && (
          <button onClick={() => alert("Make a Request")}>
            Make a Request
          </button>
        )}
        {userData.role_id === 1 && (
          <button onClick={() => navigate("/admin")}>Admin Dashboard</button>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
