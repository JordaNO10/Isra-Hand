// FILE 1: donationFormHelpers.js (✅ Includes user_id in form submission)
import axios from "axios";
import Cookies from "js-cookie";

/**
 * Fetch all categories for the dropdown
 */
export const fetchCategories = async (setCategories) => {
  try {
    const response = await axios.get("/categories");
    setCategories(response.data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

/**
 * Create and validate donation form submission
 */
export const submitDonationForm = async (
  formData,
  selectedFile,
  navigate,
  setFormData,
  setSelectedFile
) => {
  // Validation check
  if (
    !formData.donation_name ||
    !formData.description ||
    !formData.email ||
    !formData.category_name ||
    !formData.sub_category_name ||
    !formData.Phonenumber ||
    !selectedFile
  ) {
    alert("Please fill in all fields, including uploading an image.");
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append("donationname", formData.donation_name);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("Phonenumber", formData.Phonenumber);
  formDataToSend.append("categoryName", formData.category_name);
  formDataToSend.append("subCategoryName", formData.sub_category_name);
  formDataToSend.append("user_id", Cookies.get("userId"));
  formDataToSend.append("image", selectedFile);

  try {
    await axios.post("/donations", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Donation added successfully!");
    setFormData({
      donation_name: "",
      description: "",
      email: "",
      category_name: "",
      sub_category_name: "",
      Phonenumber: "",
    });
    setSelectedFile(null);
    navigate("/Donations");
  } catch (error) {
    console.error("Failed to add donation:", error);
    alert("Failed to add donation. Please try again.");
  }
};

/**
 * Fetch all donations (for dropdown use)
 */
export const fetchDonationsForDropdown = async (
  setDonations,
  setError,
  setLoading
) => {
  try {
    const response = await axios.get("/donations");
    setDonations(response.data);
  } catch (error) {
    setError(error.response?.data?.error || error.message);
  } finally {
    setLoading(false);
  }
};
