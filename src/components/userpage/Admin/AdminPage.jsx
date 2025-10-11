/**
 * דף ניהול (AdminPage):
 * מרכז טבלאות משתמשים/תרומות וניהול קטגוריות, ופותח מודלים רלוונטיים.
 */
import { useEffect, useState, useMemo } from "react";
import {
  fetchAdminData,
  deleteUser,
  deleteDonation,
  deleteCategory,
  updateUser,
  updateCategory,
  addNewCategory,
  formatLastLogin,
  deleteSubCategory,
} from "../Helpers/useAdminDashboardHelpers";
import UsersTable from "./Users/UsersTable";
import DonationsTable from "./Donations/DonationsTable";
import CategoryGrid from "./Categories/CategoryGrid";
import SubcategoryPanel from "./Categories/SubcategoryPanel";
import NewCategoryForm from "./Categories/NewCategoryForm";
import UserEditModal from "../Modals/UserEditModal";
import Singlepage from "../../Donations/Singlepage/singlePage";
import "../css/AdminPage.css";

const AdminPage = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [editingSubIndex, setEditingSubIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  // NEW: queries for Users / Donations
  const [usersQuery, setUsersQuery] = useState("");
  const [donationsQuery, setDonationsQuery] = useState("");

  // NEW: simple debounce hook for snappy typing
  const useDebounced = (value, delay = 300) => {
    const [v, setV] = useState(value);
    useMemo(() => {
      const t = setTimeout(() => setV(value), delay);
      return () => clearTimeout(t);
    }, [value, delay]);
    return v;
  };
  const debouncedUsersQuery = useDebounced(usersQuery);
  const debouncedDonationsQuery = useDebounced(donationsQuery);

  const refreshAdminData = async () => {
    try {
      setIsLoading(true);
      const { usersData, donationsData, categoriesData } =
        await fetchAdminData();
      setUsers(usersData);
      setDonations(donationsData);
      setCategories(categoriesData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAdminData();
  }, []);

  const selectedCategory = categories.find(
    (c) => c.group_id === selectedGroupId
  );

  return (
    <div className="admin-page">
      <h1>ניהול המערכת</h1>

      {/* ===== Users Section ===== */}
      <section className="admin-section">
        {/* NEW: header with search input */}
        <div className="admin-section-header">
          <h2>משתמשים</h2>
          <input
            type="text"
            placeholder="חיפוש משתמשים: שם משתמש, שם מלא , אימייל , סוג משתמש ..."
            value={usersQuery}
            onChange={(e) => setUsersQuery(e.target.value)}
            className="admin-search"
            disabled={isLoading}
          />
        </div>

        <UsersTable
          users={users}
          formatLastLogin={formatLastLogin}
          // NEW: pass debounced query (safe if unused in the component)
          query={debouncedUsersQuery}
          onEdit={(user) => {
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
          onDelete={(id) => deleteUser(id, setUsers)}
        />
      </section>

      {/* ===== Donations Section ===== */}
      <section className="admin-section">
        {/* NEW: header with search input */}
        <div className="admin-section-header">
          <h2>תרומות</h2>
          <input
            type="text"
            placeholder="חיפוש תרומה : שם תרומה , תיאור תרומה ..."
            value={donationsQuery}
            onChange={(e) => setDonationsQuery(e.target.value)}
            className="admin-search"
            disabled={isLoading}
          />
        </div>

        <DonationsTable
          donations={donations}
          // NEW: pass debounced query (safe if unused in the component)
          query={debouncedDonationsQuery}
          onOpen={(d) => setSelectedDonation(d)}
          onDelete={(id) => deleteDonation(id, setDonations)}
        />
      </section>

      {/* ===== Categories Section ===== */}
      <section className="admin-section">
        <h2>קטגוריות</h2>
        <NewCategoryForm
          value={newCategoryName}
          onChange={setNewCategoryName}
          onAdd={async () => {
            if (!newCategoryName.trim()) return;
            await addNewCategory(newCategoryName.trim());
            setNewCategoryName("");
            await refreshAdminData();
          }}
        />
        <div className="category-management">
          <CategoryGrid
            categories={categories}
            selectedId={selectedGroupId}
            onSelect={(gid) => {
              setSelectedGroupId(gid);
              setFormValues({});
            }}
          />
          {selectedCategory && (
            <SubcategoryPanel
              category={selectedCategory}
              formValues={formValues}
              setFormValues={setFormValues}
              editingIndex={editingSubIndex}
              setEditingIndex={setEditingSubIndex}
              onSaveSub={async (subObj, newVal) => {
                await updateCategory(
                  subObj.category_id,
                  selectedCategory.category_name,
                  newVal,
                  subObj.sub_category
                );
                setEditingSubIndex(null);
                await refreshAdminData();
              }}
              onDeleteSub={async (subObj) => {
                await deleteSubCategory(
                  subObj.category_id,
                  subObj.sub_category
                );
                await refreshAdminData();
              }}
              onAddSub={async () => {
                if (!newSubCategory.trim()) return;
                await addNewCategory(
                  selectedCategory.category_name,
                  newSubCategory
                );
                setNewSubCategory("");
                await refreshAdminData();
              }}
              newSubValue={newSubCategory}
              setNewSubValue={setNewSubCategory}
              onDeleteCategory={() =>
                deleteCategory(selectedCategory.category_name, setCategories)
              }
            />
          )}
        </div>
      </section>

      {selectedDonation && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setSelectedDonation(null)}
            >
              ✖
            </button>
            <Singlepage
              donationId={selectedDonation.donation_id}
              onClose={() => setSelectedDonation(null)}
              isAdminView
            />
          </div>
        </div>
      )}

      <UserEditModal
        user={userToEdit}
        formValues={formValues}
        onChange={(e) =>
          setFormValues({ ...formValues, [e.target.name]: e.target.value })
        }
        onSave={async () => {
          await updateUser(userToEdit.user_id, formValues);
          // עדכון שם במידה וזה המשתמש הנוכחי
          const currentUserId = document.cookie
            .split("; ")
            .find((r) => r.startsWith("userId="))
            ?.split("=")[1];
          if (String(userToEdit.user_id) === currentUserId) {
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
