// src/helpers/donationFormHelpers.js
import axios from "axios";

// Fetch categories for the form
export const fetchCategories = async (setCategories) => {
  try {
    const response = await axios.get("/categories");
    setCategories(response.data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

// Submit donation form (with validation inside)
export const submitDonationForm = async (
  formData,
  selectedFile,
  navigate,
  setFormData,
  setSelectedFile
) => {
  if (
    !formData.donationname ||
    !formData.description ||
    !formData.email ||
    !formData.categoryId ||
    !selectedFile
  ) {
    alert("Please fill in all fields, including uploading an image.");
    return;
  }

  const formDataToSend = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, value);
  });
  formDataToSend.append("image", selectedFile);

  try {
    await axios.post("/donationadd", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Donation added successfully!");
    setFormData({
      donationname: "",
      description: "",
      email: "",
      categoryId: "",
    });
    setSelectedFile(null);
    navigate("/Donations");
  } catch (error) {
    console.error("Failed to add donation:", error);
    alert("Failed to add donation. Please try again.");
  }
};

// Fetch donations for dropdowns
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
