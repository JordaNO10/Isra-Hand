import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/AdminPage.css"; // Import your CSS file for styling

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, donationsRes, categoriesRes] = await Promise.all([
          axios.get("/users"),
          axios.get("/donations"),
          axios.get("/categories"),
        ]);
        setUsers(usersRes.data);
        setDonations(donationsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-section">
        <h2>Users</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li key={`${user.user_id}-${user.username}`} className="user-item">
              <strong>{user.username}</strong> - {user.full_name} - {user.email}
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate("/manage-users")}
          className="manage-button"
        >
          Manage Users
        </button>
      </div>

      <div className="admin-section">
        <h2>Donations</h2>
        <p>Total Donations: {donations.length}</p>
        <ul className="donation-list">
          {donations.map((donation) => (
            <li key={donation.donation_id} className="donation-item">
              {" "}
              {/* Make sure to use the correct unique key */}
              {donation.description} - ${donation.amount}
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate("/donations")}
          className="manage-button"
        >
          View Donations
        </button>
      </div>

      <div className="admin-section">
        <h2>Categories</h2>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.category_id} className="category-item">
              {category.category_name}
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate("/manage-categories")}
          className="manage-button"
        >
          Manage Categories
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
