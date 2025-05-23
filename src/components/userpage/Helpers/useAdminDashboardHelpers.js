import axios from "axios";

// Fetch all data for admin page
export const fetchAdminData = async () => {
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
export const deleteUser = async (userId, setUsers) => {
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
export const deleteDonation = async (donationId, setDonations) => {
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
export const deleteCategory = async (categoryId, setCategories) => {
  if (window.confirm("האם אתה בטוח שברצונך למחוק קטגוריה זו?")) {
    try {
      await axios.delete(`/categories/${categoryId}`);
      setCategories((prev) =>
        prev.filter((category) => category.category_id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  }
};

// Update user
export const updateUser = async (userId, userData) => {
  try {
    await axios.put(`/users/${userId}`, userData);
  } catch (error) {
    console.error("Error updating user:", error);
    alert("נכשל בעדכון המשתמש");
  }
};

// Update donation
export const updateDonation = async (donationId, description) => {
  try {
    await axios.put(`/donations/${donationId}`, { description });
  } catch (error) {
    console.error("Error updating donation:", error);
    alert("נכשל בעדכון התרומה");
  }
};

// Update category
export const updateCategory = async (categoryId, categoryName) => {
  try {
    await axios.put(`/categories/${categoryId}`, {
      category_name: categoryName,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    alert("נכשל בעדכון הקטגוריה");
  }
};
