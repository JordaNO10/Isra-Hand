/**
 * useDonationForm
 * תפקיד: הוקים לטופס הוספה/עריכת תרומה, עם פונקציות קצרות וברורות.
 * שינוי: ללא—תואם backend (/donations) וה-helpers הקיימים.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitDonationForm } from "./donationFormHelpers";

const createInputChangeHandler = (setFormData) => (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

const createImageUploadHandler = (setSelectedFile) => (file) => setSelectedFile(file);

export const useDonationAddForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData]     = useState({
    donation_name: "",
    Phonenumber: "",
    description: "",
    email: "",
    category_name: "",
    sub_category_name: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = createInputChangeHandler(setFormData);
  const handleImageUpload = createImageUploadHandler(setSelectedFile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitDonationForm(formData, selectedFile, navigate, setFormData, setSelectedFile);
  };

  return { formData, setFormData, handleInputChange, handleImageUpload, handleSubmit };
};

export const useDonationEditForm = (editedData, onSave, onChange) => {
  const navigate = useNavigate();
  const [temporaryImage, setTemporaryImage] = useState(null);
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [errorMessage, setErrorMessage]     = useState("");

  const handleChange = (e) => onChange({ ...editedData, [e.target.name]: e.target.value });
  const handleImageUpload = (image) => setTemporaryImage(image);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editedData.donation_name || !editedData.email || !editedData.description) {
      setErrorMessage("נא למלא את כל השדות.");
      return;
    }
    onSave({ ...editedData, image: temporaryImage || editedData.image });
    setErrorMessage("");
  };

  const handleBack = () => navigate("/donations");
  const toggleModal = () => setIsModalOpen((v) => !v);

  return { temporaryImage, isModalOpen, errorMessage, handleChange, handleImageUpload, handleSubmit, handleBack, toggleModal };
};
