import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/adminpage.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newBirthdate, setNewBirthdate] = useState(""); // Renamed for clarity
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editDonationId, setEditDonationId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const [newRoleId, setNewRoleId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState(""); // New state for password
  const [newDonationDescription, setNewDonationDescription] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

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

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/users/${userId}`);
        setUsers(users.filter((user) => user.user_id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const handleDeleteDonation = async (donationId) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await axios.delete(`/donations/${donationId}`);
        setDonations(
          donations.filter((donation) => donation.donation_id !== donationId)
        );
      } catch (err) {
        console.error("Error deleting donation:", err);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`/categories/${categoryId}`);
        setCategories(
          categories.filter((category) => category.category_id !== categoryId)
        );
      } catch (err) {
        console.error("Error deleting category:", err);
      }
    }
  };

  const handleCreateUser = async () => {
    if (
      !newUserName ||
      !newRoleId ||
      !newFullName ||
      !newEmail ||
      !newBirthdate ||
      !newPassword
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("/users", {
        username: newUserName,
        role_id: newRoleId,
        full_name: newFullName,
        email: newEmail,
        birth_date: newBirthdate,
        password: newPassword, // Include password in the request
      });

      setUsers([...users, response.data]);
      setShowCreateUserForm(false);
      setNewUserName("");
      setNewRoleId("");
      setNewFullName("");
      setNewEmail("");
      setNewBirthdate("");
      setNewPassword(""); // Clear password input after submission
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleCreateDonation = async () => {
    try {
      const response = await axios.post("/donations", {
        description: newDonationDescription,
      });
      setDonations([...donations, response.data]);
      setNewDonationDescription("");
    } catch (err) {
      console.error("Error creating donation:", err);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    try {
      const response = await axios.post("/categories", {
        category_name: newCategoryName,
      });
      setCategories([...categories, response.data]);
      setNewCategoryName("");
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  const handleEditUser = (userId) => {
    const user = users.find((u) => u.user_id === userId);
    setEditUserId(userId);
    setNewUserName(user.username);
  };

  const handleEditDonation = (donationId) => {
    const donation = donations.find((d) => d.donation_id === donationId);
    setEditDonationId(donationId);
    setNewDonationDescription(donation.description);
  };

  const handleEditCategory = (categoryId) => {
    const category = categories.find((c) => c.category_id === categoryId);
    setEditCategoryId(categoryId);
    setNewCategoryName(category.category_name);
  };

  const updateUser = async () => {
    const updatedData = {}; // Create the updatedData object at the start

    // Check if the user wants to update the birth date
    if (newBirthdate) {
      const birthDateObject = new Date(newBirthdate);
      if (!isNaN(birthDateObject.getTime())) {
        // Valid birth date provided
        updatedData.birth_date = birthDateObject.toISOString().split("T")[0];
      } else {
        // If newBirthdate is provided but invalid
        alert("Invalid birth date format. Please use YYYY-MM-DD.");
        return;
      }
    }

    // Prepare the update data, including only fields that are provided
    if (newUserName) updatedData.username = newUserName;
    if (newFullName) updatedData.full_name = newFullName;
    if (newEmail) updatedData.email = newEmail;
    if (newRoleId) updatedData.role_id = newRoleId;
    if (newPassword) updatedData.password = newPassword;

    // Perform the update request only if there's something to update
    if (Object.keys(updatedData).length > 0) {
      try {
        await axios.put(`/users/${editUserId}`, updatedData);

        // Update the users state with the modified user
        setUsers(
          users.map((user) =>
            user.user_id === editUserId
              ? {
                  ...user,
                  ...updatedData, // Update only the fields that were modified
                }
              : user
          )
        );

        // Clear input fields after updating
        setEditUserId(null);
        setNewUserName("");
        setNewFullName("");
        setNewEmail("");
        setNewRoleId("");
        setNewBirthdate("");
        setNewPassword(""); // Clear password input after submission
      } catch (err) {
        console.error("Error updating user:", err);
        alert("Failed to update user. Please try again.");
      }
    } else {
      // If there were no fields to update, you can notify the user if needed
      alert("No changes were made to the user.");
    }
  };

  const updateDonation = async () => {
    try {
      await axios.put(`/donations/${editDonationId}`, {
        description: newDonationDescription,
      });
      setDonations(
        donations.map((donation) =>
          donation.donation_id === editDonationId
            ? { ...donation, description: newDonationDescription }
            : donation
        )
      );
      setEditDonationId(null);
      setNewDonationDescription("");
    } catch (err) {
      console.error("Error updating donation:", err);
    }
  };

  const updateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    try {
      await axios.put(`/categories/${editCategoryId}`, {
        category_name: newCategoryName,
      });

      setCategories(
        categories.map((category) =>
          category.category_id === editCategoryId
            ? { ...category, category_name: newCategoryName }
            : category
        )
      );

      setEditCategoryId(null);
      setNewCategoryName("");
    } catch (err) {
      console.error("Error updating category:", err);
      alert("Failed to update category. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Users Section */}
      <div className="admin-users-section">
        <h2>Users</h2>
        <button onClick={() => setShowCreateUserForm(!showCreateUserForm)}>
          {showCreateUserForm ? "Cancel" : "Create User"}
        </button>

        {showCreateUserForm && (
          <div className="create-user-form">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="text"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              placeholder="Full Name"
              required
            />
            <input
              type="text"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="date"
              value={newBirthdate}
              onChange={(e) => setNewBirthdate(e.target.value)}
              required
            />
            <input
              type="text"
              value={newRoleId}
              onChange={(e) => setNewRoleId(e.target.value)}
              placeholder="Role ID"
              required
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button onClick={handleCreateUser}>Create User</button>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>שם משתמש</th>
              <th>שם מלא</th>
              <th>אימייל</th>
              <th>תאריך לידה</th>
              <th>מספר פלאפון</th>
              <th>סוג משתמש</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.username}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.birth_date}</td>
                <td>{user.phone_number}</td>
                <td>{user.role_name}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user.user_id)}>
                    מחיקת משתמש
                  </button>
                  <button onClick={() => handleEditUser(user.user_id)}>
                    עדכון פרטי משתמש
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Donations Section */}
      <div className="admin-donations-section">
        <h2>תרומות</h2>
        <div className="create-donation-form">
          <input
            type="text"
            value={newDonationDescription}
            onChange={(e) => setNewDonationDescription(e.target.value)}
            placeholder="Donation Description"
            required
          />
          <button onClick={handleCreateDonation}>יצירת תרומה</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>קוד התרומה</th>
              <th>שם התרומה</th>
              <th>תיאור התרומה</th>
              <th>תאריך העאלת התרומה</th>
              <th>תצלום התרומה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.donation_id}>
                <td>{donation.donation_id}</td>
                <td>{donation.donation_name}</td>
                <td>{donation.description}</td>
                <td>{donation.donation_date}</td>
                <td>
                  <img
                    src={donation.donat_photo}
                    alt="Donation"
                    style={{ maxWidth: "100px", height: "auto" }} // Adjust size as needed
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteDonation(donation.donation_id)}
                  >
                    מחיקת תרומה
                  </button>
                  <button
                    onClick={() => handleEditDonation(donation.donation_id)}
                  >
                    עדכון תרומה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Categories Section */}
      <div className="admin-categories-section">
        <h2>קטגוריות</h2>
        <div className="create-category-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name"
            required
          />
          <button onClick={handleCreateCategory}>יצירת קטגוריה</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>שם קטגוריה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.category_id}>
                <td>{category.category_name}</td>
                <td>
                  <button
                    onClick={() => handleDeleteCategory(category.category_id)}
                  >
                    מחיקת קטגוריה
                  </button>
                  <button
                    onClick={() => handleEditCategory(category.category_id)}
                  >
                    עדכון קטגוריה
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
