import axios from "axios";

// Fetch all data for admin page
const fetchAdminData = async () => {
  const [usersRes, donationsRes, categoriesRes] = await Promise.all([
    axios.get("/users"),
    axios.get("/donations"),
    axios.get("/categories"),
  ]);

  return {
    usersData: usersRes.data,
    donationsData: donationsRes.data,
    categoriesData: categoriesRes.data,
  };
};

// Delete user
const deleteUser = async (userId, setUsers) => {
  if (window.confirm("האם אתה בטוח שברצונך למחוק משתמש זה?")) {
    try {
      await axios.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((user) => user.user_id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
};

// Delete donation
const deleteDonation = async (donationId, setDonations) => {
  if (window.confirm("האם אתה בטוח שברצונך למחוק תרומה זו?")) {
    try {
      await axios.delete(`/donations/${donationId}`);
      setDonations((prev) =>
        prev.filter((donation) => donation.donation_id !== donationId)
      );
    } catch (error) {
      console.error("Error deleting donation:", error);
    }
  }
};

// Delete category
const deleteCategory = async (categoryName, setCategories) => {
  if (window.confirm("האם אתה בטוח שברצונך למחוק קטגוריה זו?")) {
    try {
      await axios.delete(`/categories/${encodeURIComponent(categoryName)}`);
      setCategories((prev) =>
        prev.filter((category) => category.category_name !== categoryName)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
};

// Delete subcategory
const deleteSubCategory = async (categoryId, subCategory) => {
  if (
    window.confirm(
      `האם אתה בטוח שברצונך למחוק את התת-קטגוריה "${subCategory}"?`
    )
  ) {
    try {
      await axios.delete(
        `/categories/sub/${categoryId}/${encodeURIComponent(subCategory)}`
      );
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      alert("נכשל במחיקת תת-הקטגוריה");
    }
  }
};

// Update user
const updateUser = async (userId, userData) => {
  try {
    await axios.put(`/users/${userId}`, userData);
  } catch (error) {
    console.error("Error updating user:", error);
    alert("נכשל בעדכון המשתמש");
  }
};

// Update donation
const updateDonation = async (donationId, description) => {
  try {
    await axios.put(`/donations/${donationId}`, { description });
  } catch (error) {
    console.error("Error updating donation:", error);
    alert("נכשל בעדכון התרומה");
  }
};

// Update category or subcategory
const updateCategory = async (
  categoryId,
  categoryName,
  subCategory = null,
  originalSubCategory = null
) => {
  try {
    await axios.put(`/categories/${categoryId}`, {
      category_name: categoryName,
      sub_category: subCategory,
      sub_category_old: originalSubCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    alert("נכשל בעדכון הקטגוריה");
  }
};

// Add new category
const addNewCategory = async (categoryName, subCategory = null) => {
  try {
    const response = await axios.post("/categories/add", {
      category_name: categoryName,
      sub_category: subCategory,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new category:", error);
    throw error;
  }
};

// Format last login date
const formatLastLogin = (isoString) => {
  if (!isoString) return "לא התחבר עדיין";
  const date = new Date(isoString);
  return date.toLocaleString("he-IL", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export {
  fetchAdminData,
  deleteUser,
  deleteDonation,
  deleteCategory,
  deleteSubCategory,
  updateUser,
  updateDonation,
  updateCategory,
  addNewCategory,
  formatLastLogin,
};
