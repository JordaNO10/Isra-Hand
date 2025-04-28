import React, { useEffect, useState } from "react";
import {
  fetchAdminData,
  deleteUser,
  deleteDonation,
  deleteCategory,
  updateUser,
  updateDonation,
  updateCategory,
} from "./Helpers/useAdminDashboardHelpers";
import "./css/AdminPage.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit State
  const [editingUser, setEditingUser] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const { usersData, donationsData, categoriesData } =
          await fetchAdminData();
        setUsers(usersData);
        setDonations(donationsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error(err);
        setError("נכשל בטעינת הנתונים");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="admin-loading">טוען...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-page">
      <h1>פרופיל אדמין:</h1>

      <div className="admin-profile">
        <h2>ברוך הבא, מנהל!</h2>
        <div className="profile-box">
          <p>
            <strong>פרטים אישיים:</strong>
          </p>
          <p>אימייל: mail@gmail.com</p>
          <p>סוג משתמש: Admin</p>
        </div>
      </div>

      {/* Users */}
      <div className="admin-section">
        <h2>משתמשים:</h2>
        <table>
          <thead>
            <tr>
              <th>שם משתמש</th>
              <th>שם מלא</th>
              <th>אימייל</th>
              <th>תאריך לידה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.user_id}>
                <tr>
                  <td>{user.username}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{user.birth_date}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setFormValues(user);
                      }}
                    >
                      עדכון
                    </button>
                    <button onClick={() => deleteUser(user.user_id, setUsers)}>
                      מחיקה
                    </button>
                  </td>
                </tr>
                {editingUser?.user_id === user.user_id && (
                  <tr>
                    <td colSpan="5">
                      <div className="edit-form">
                        <input
                          name="username"
                          placeholder="שם משתמש"
                          value={formValues.username || ""}
                          onChange={handleFormChange}
                        />
                        <input
                          name="full_name"
                          placeholder="שם מלא"
                          value={formValues.full_name || ""}
                          onChange={handleFormChange}
                        />
                        <input
                          name="email"
                          placeholder="אימייל"
                          value={formValues.email || ""}
                          onChange={handleFormChange}
                        />
                        <button
                          onClick={async () => {
                            await updateUser(user.user_id, formValues);
                            setEditingUser(null);
                            window.location.reload();
                          }}
                        >
                          שמירה
                        </button>
                        <button onClick={() => setEditingUser(null)}>
                          ביטול
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Donations */}
      <div className="admin-section">
        <h2>תרומות:</h2>
        <table>
          <thead>
            <tr>
              <th>קוד תרומה</th>
              <th>שם התרומה</th>
              <th>תיאור</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <React.Fragment key={donation.donation_id}>
                <tr>
                  <td>{donation.donation_id}</td>
                  <td>{donation.donation_name}</td>
                  <td>{donation.description}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingDonation(donation);
                        setFormValues({ description: donation.description });
                      }}
                    >
                      עדכון
                    </button>
                    <button
                      onClick={() =>
                        deleteDonation(donation.donation_id, setDonations)
                      }
                    >
                      מחיקה
                    </button>
                  </td>
                </tr>
                {editingDonation?.donation_id === donation.donation_id && (
                  <tr>
                    <td colSpan="4">
                      <div className="edit-form">
                        <input
                          name="description"
                          placeholder="תיאור תרומה"
                          value={formValues.description || ""}
                          onChange={handleFormChange}
                        />
                        <button
                          onClick={async () => {
                            await updateDonation(
                              donation.donation_id,
                              formValues.description
                            );
                            setEditingDonation(null);
                            window.location.reload();
                          }}
                        >
                          שמירה
                        </button>
                        <button onClick={() => setEditingDonation(null)}>
                          ביטול
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Categories */}
      <div className="admin-section">
        <h2>קטגוריות:</h2>
        <table>
          <thead>
            <tr>
              <th>שם קטגוריה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <React.Fragment key={category.category_id}>
                <tr>
                  <td>{category.category_name}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEditingCategory(category);
                        setFormValues({
                          category_name: category.category_name,
                        });
                      }}
                    >
                      עדכון
                    </button>
                    <button
                      onClick={() =>
                        deleteCategory(category.category_id, setCategories)
                      }
                    >
                      מחיקה
                    </button>
                  </td>
                </tr>
                {editingCategory?.category_id === category.category_id && (
                  <tr>
                    <td colSpan="2">
                      <div className="edit-form">
                        <input
                          name="category_name"
                          placeholder="שם קטגוריה"
                          value={formValues.category_name || ""}
                          onChange={handleFormChange}
                        />
                        <button
                          onClick={async () => {
                            await updateCategory(
                              category.category_id,
                              formValues.category_name
                            );
                            setEditingCategory(null);
                            window.location.reload();
                          }}
                        >
                          שמירה
                        </button>
                        <button onClick={() => setEditingCategory(null)}>
                          ביטול
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
