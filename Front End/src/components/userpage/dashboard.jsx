import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import Axios
import Cookies from "js-cookie"; // Import js-cookie to manage cookies
import "./css/dashboard.css";
const UserDashboard = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const [logoutMessage, setLogoutMessage] = useState(""); // State for logout message
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = Cookies.get("userId"); // Get user_id from the cookies
      if (!userId) {
        console.log(userId);
        setError("User ID not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/users/${userId}`); // Fetch user data using userId from cookies
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data."); // Set error message
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run only once on mount

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout"); // Adjust the endpoint as needed
      if (response.status === 200) {
        Cookies.remove("userId"); // Remove the cookie on successful logout
        setLogoutMessage("You have been logged out successfully!"); // Set logout message
        setTimeout(() => {
          onLogout(); // Call the logout prop to update the app state
          navigate("/"); // Navigate to the homepage
        }, 2000); // Redirect after 2 seconds
      } else {
        alert("Logout failed. Please try again."); // Handle unexpected response
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  if (!userData) {
    return <div>User not found.</div>; // Handle case where user data is not available
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {userData.username}!</h1>
      <p>Email: {userData.email}</p>
      <p>Role: {userData.role_name}</p>
      <div className="actions">
        <h2>Your Actions</h2>
        <button onClick={() => alert("View Donations")}>View Donations</button>
        <button onClick={() => alert("Make a Request")}>Make a Request</button>
      </div>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
      {logoutMessage && <div className="logout-message">{logoutMessage}</div>}
    </div>
  );
};

export default UserDashboard;
