import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCategories, submitDonationForm } from "./donationFormHelpers";

// Hook for Add Donation Page
export const useDonationAddForm = (navigate) => {
  const [formData, setFormData] = useState({
    donation_name: "",
    Phonenumber: "",
    description: "",
    email: "",
    category_id: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageFile) => {
    setSelectedFile(imageFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await submitDonationForm(
      formData,
      selectedFile,
      navigate,
      setFormData,
      setSelectedFile
    );
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
  };
};

// Hook for Edit Donation Page
export const useDonationEditForm = (editedData, onSave, onChange) => {
  const navigate = useNavigate();
  const [temporaryImage, setTemporaryImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...editedData, [name]: value });
  };

  const handleImageUpload = (image) => {
    setTemporaryImage(image);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !editedData.donation_name ||
      !editedData.email ||
      !editedData.description
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const updatedData = {
      ...editedData,
      image: temporaryImage || editedData.image,
    };

    onSave(updatedData);
    setErrorMessage("");
  };

  const handleBack = () => {
    navigate("/donations");
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return {
    temporaryImage,
    isModalOpen,
    errorMessage,
    handleChange,
    handleImageUpload,
    handleSubmit,
    handleBack,
    toggleModal,
  };
};
export const fetchDonationsForDropdown = async (
  setDonations,
  setError,
  setLoading
) => {
  try {
    setLoading(true);
    const res = await axios.get("/donations/available"); // or your endpoint
    setDonations(res.data); // must be an array
  } catch (err) {
    setError("Failed to fetch donations");
  } finally {
    setLoading(false);
  }
};
