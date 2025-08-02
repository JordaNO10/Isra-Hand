import { useEffect, useState } from "react";
import {
  fetchAdminData,
  deleteUser,
  deleteDonation,
  deleteCategory,
  updateUser,
  updateDonation,
  updateCategory,
  addNewCategory,
  formatLastLogin,
  deleteSubCategory,
} from "./Helpers/useAdminDashboardHelpers";
import UserEditModal from "./UserEditModal"; // Adjust path as needed
import "./css/AdminPage.css";

const AdminPage = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [editingSubIndex, setEditingSubIndex] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [editingUser, setEditingUser] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAdminData = async () => {
    try {
      setIsLoading(true);
      const { usersData, donationsData, categoriesData } =
        await fetchAdminData();
      setUsers(usersData);
      setDonations(donationsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("שגיאה ברענון הנתונים", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleUserUpdate = async (userId) => {
    await updateUser(userId, formValues);
    setEditingUser(null);
    refreshAdminData();
  };

  const handleDonationUpdate = async (donationId) => {
    await updateDonation(donationId, formValues.description);
    setEditingDonation(null);
    refreshAdminData();
    await refreshAdminData();
  };

  const handleCategoryClick = (groupId) => {
    setSelectedGroupId(groupId);
    setFormValues({});
  };

  const handleDeleteCategory = async (categoryId) => {
    await deleteCategory(categoryId, setCategories);
    setSelectedGroupId(null);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await addNewCategory(newCategoryName.trim()); // ✅ ensure fully complete
      setNewCategoryName("");
      await refreshAdminData(); // ✅ force re-fetch
    } catch (err) {
      console.error("Add category failed", err);
      alert("שגיאה בהוספת קטגוריה");
    }
  };

  const updateSubCategory = async (id, name, sub, originalSub = null) => {
    await updateCategory(id, name, sub, originalSub);
    await refreshAdminData();
  };

  const selectedCategory = categories.find(
    (cat) => cat.group_id === selectedGroupId
  );

  const roleMap = {
    1: "Admin",
    2: "Donor",
    3: "Requestor",
  };
  return (
    <div className="admin-page">
      <h1>ניהול המערכת</h1>

      {/* Users */}
      <div className="admin-section">
        <h2>משתמשים</h2>
        <table>
          <thead>
            <tr>
              <th>שם משתמש</th>
              <th>אימייל</th>
              <th>סוג</th>
              <th>כניסה אחרונה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{roleMap[user.role_id] || "לא ידוע"}</td>
                {""}
                <td>{formatLastLogin(user.last_login)}</td>
                <td>
                  <button
                    onClick={() => {
                      setUserToEdit(user);
                      setFormValues({
                        full_name: user.full_name,
                        email: user.email,
                        phone_number: user.phone_number,
                        address: user.address,
                        role_id: user.role_id,
                      });
                      setShowUserModal(true);
                    }}
                  >
                    ערוך
                  </button>
                  <button onClick={() => deleteUser(user.user_id, setUsers)}>
                    מחק
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Donations */}
      <div className="admin-section">
        <h2>תרומות</h2>
        <table>
          <thead>
            <tr>
              <th>שם תרומה</th>
              <th>תיאור</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.donation_id}>
                <td>{donation.donation_name}</td>
                <td>
                  {editingDonation === donation.donation_id ? (
                    <input name="description" onChange={handleInputChange} />
                  ) : (
                    donation.description
                  )}
                </td>
                <td>
                  {editingDonation === donation.donation_id ? (
                    <button
                      onClick={() => handleDonationUpdate(donation.donation_id)}
                    >
                      שמור
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingDonation(donation.donation_id)}
                      >
                        ערוך
                      </button>
                      <button
                        onClick={() =>
                          deleteDonation(donation.donation_id, setDonations)
                        }
                      >
                        מחק
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Categories */}
      <div className="admin-section">
        <h2>קטגוריות</h2>

        {/* Add Category */}
        <div className="add-category-form">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="הוסף קטגוריה חדשה..."
          />
          <button onClick={handleAddCategory}>הוסף</button>
        </div>

        {/* Category Grid */}
        <div className="category-management">
          <div className="category-grid">
            {categories.map((cat) => (
              <div
                key={cat.group_id}
                className={`category-tile ${
                  selectedCategory?.group_id === cat.group_id ? "selected" : ""
                }`}
                onClick={() => handleCategoryClick(cat.group_id)}
              >
                <div className="category-name">{cat.category_name}</div>
                <ul className="subcategory-list">
                  {cat.subCategories?.map((sub, idx) => (
                    <li key={idx}>{sub.sub_category}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Subcategory Panel */}
          {selectedCategory && (
            <div className="subcategory-panel">
              <h3>תתי קטגוריות: {selectedCategory.category_name}</h3>

              {selectedCategory.subCategories.map((sub, index) => {
                const isEditing = editingSubIndex === index;
                return (
                  <div key={index} className="subcategory-row">
                    <input
                      value={
                        isEditing
                          ? formValues.editedSub !== undefined
                            ? formValues.editedSub
                            : sub.sub_category
                          : sub.sub_category
                      }
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          editedSub: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                    />
                    <button
                      onClick={() => {
                        console.log("Editing subcategory:", {
                          subcategory: sub.sub_category,
                          index,
                          category_id: sub.category_id,
                          category_name: selectedCategory.category_name,
                        });

                        if (isEditing) {
                          updateSubCategory(
                            sub.category_id,
                            selectedCategory.category_name,
                            formValues.editedSub,
                            sub.sub_category
                          );
                          setEditingSubIndex(null);
                        } else {
                          setEditingSubIndex(index);
                        }
                      }}
                    >
                      {isEditing ? "שמור" : "ערוך"}
                    </button>
                    {/* Delete subcategory button */}
                    <button
                      className="delete-subcategory"
                      onClick={async () => {
                        await deleteSubCategory(
                          sub.category_id,
                          sub.sub_category
                        );
                        await refreshAdminData();
                      }}
                    >
                      מחיקת תת קטגוריה
                    </button>
                  </div>
                );
              })}

              <div className="add-subcategory-row">
                <input
                  placeholder="הוסף תת-קטגוריה חדשה..."
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                />
                <button
                  onClick={async () => {
                    if (!newSubCategory.trim()) return;
                    try {
                      await addNewCategory(
                        selectedCategory.category_name,
                        newSubCategory
                      );
                      setNewSubCategory("");
                      await refreshAdminData(); // ✅ Soft reload AFTER data added
                    } catch (err) {
                      console.error("Failed to add subcategory:", err);
                      alert("שגיאה בהוספת תת-קטגוריה");
                    }
                  }}
                >
                  הוסף תת-קטגוריה
                </button>
              </div>

              {/* Caution: this deletes only the FIRST sub */}
              <button
                className="delete-category"
                onClick={() =>
                  handleDeleteCategory(selectedCategory.category_name)
                }
              >
                מחק קטגוריה
              </button>
            </div>
          )}
        </div>
      </div>
      <UserEditModal
        user={userToEdit}
        formValues={formValues}
        onChange={handleInputChange}
        onSave={async () => {
          await updateUser(userToEdit.user_id, formValues);

          const currentUserId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userId="))
            ?.split("=")[1];

          if (userToEdit.user_id.toString() === currentUserId) {
            document.cookie = `fullName=${formValues.full_name}; path=/`;
            window.location.reload();
          }

          setShowUserModal(false);
          setUserToEdit(null);
          await refreshAdminData();
        }}
        onCancel={() => {
          setShowUserModal(false);
          setUserToEdit(null);
        }}
      />
    </div>
  );
};

export default AdminPage;
