/**
 * מסך הוספת תרומה:
 * עוטף את טופס ההעלאה ומסנכרן נתוני משתמש (אימייל/טלפון) אל הטופס.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDonationAddForm } from "../Helpers/useDonationForm";
import { useCategories } from "../Helpers/useCategories";
import "../css/donationadd.css";
import DonationAddForm from "./DonationAddForm";

function DonationAdd({ onClose, userData }) {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { formData, setFormData, handleInputChange, handleImageUpload, handleSubmit } =
    useDonationAddForm(navigate);
  const [useUserEmail, setUseUserEmail] = useState(true);

  // סנכרון אימייל/טלפון מהמשתמש המחובר לטופס
  useEffect(() => {
    if (!userData) return;
    setFormData(prev => ({
      ...prev,
      email: useUserEmail ? userData.email : prev.email,
      Phonenumber: userData.phone_number || ""
    }));
  }, [useUserEmail, userData, setFormData]);

  return (
    <div className="donationadd-overlay">
      <div className="donationadd-modal">
        <button className="close-button" onClick={onClose}>✕</button>
        <DonationAddForm
          formData={formData}
          onChange={handleInputChange}
          onImageUpload={handleImageUpload}
          onSubmit={handleSubmit}
          categories={categories}
          userEmail={userData?.email}
          useUserEmail={useUserEmail}
          setUseUserEmail={setUseUserEmail}
        />
      </div>
    </div>
  );
}
export default DonationAdd;
