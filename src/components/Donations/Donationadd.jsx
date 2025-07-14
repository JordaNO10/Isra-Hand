import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDonationAddForm } from "./Helpers/useDonationForm";
import UploadImage from "./imageupload";
import "./css/donationadd.css";
import { useCategories } from "./Helpers/useCategories";

function DonationAdd({ onClose, userData }) {
  const navigate = useNavigate();
  const { categories, loading: loadingCategories } = useCategories();

  const {
    formData,
    setFormData,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
  } = useDonationAddForm(navigate);

  const [useUserEmail, setUseUserEmail] = useState(true);
  useEffect(() => {
    if (userData) {
      setFormData((prev) => ({
        ...prev,
        email: useUserEmail ? userData.email : prev.email,
        Phonenumber: userData.phone_number || "",
      }));
    }
  }, [useUserEmail, userData, setFormData]);
  useEffect(() => {
    console.log("Loaded categories:", categories);
  }, [categories]);
  return (
    <div className="donationadd-overlay">
      <div className="donationadd-modal">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>

        <form className="donationadd-form" onSubmit={handleSubmit}>
          <h2>העלאת תרומה</h2>
          <label htmlFor="donation_name">שם התרומה:</label>
          <input
            type="text"
            name="donation_name"
            value={formData.donation_name}
            onChange={handleInputChange}
          />

          <label htmlFor="description">תיאור התרומה:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <div className="email-choice">
            <label>
              <input
                type="radio"
                name="emailOption"
                value="current"
                checked={useUserEmail}
                onChange={() => setUseUserEmail(true)}
              />
              השתמש באימייל הנוכחי ({userData?.email})
            </label>

            <label>
              <input
                type="radio"
                name="emailOption"
                value="new"
                checked={!useUserEmail}
                onChange={() => setUseUserEmail(false)}
              />
              הזן אימייל חדש
            </label>
          </div>
          {!useUserEmail && (
            <>
              <label htmlFor="email">אימייל:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </>
          )}
          <label htmlFor="Phonenumber">מספר טלפון:</label>
          <input
            type="text"
            name="Phonenumber"
            value={formData.Phonenumber}
            readOnly
          />
          <label htmlFor="category_name">קטגוריה:</label>
          <select
            name="category_name"
            value={formData.category_name}
            onChange={handleInputChange}
          >
            <option value="" disabled>
              בחר קטגוריה
            </option>
            {categories.map((cat) => (
              <option key={cat.category_name} value={cat.category_name}>
                {cat.category_name}
              </option>
            ))}
          </select>

          {/* Optional: Subcategory if categories include subCategories array */}

          <label htmlFor="sub_category_name">קטגוריה משנית:</label>
          <select
            name="sub_category_name"
            value={formData.sub_category_name}
            onChange={handleInputChange}
            disabled={!formData.category_name}
          >
            <option value="" disabled>
              בחר קטגוריה משנית
            </option>
            {(
              categories.find(
                (cat) => cat.category_name === formData.category_name
              )?.subCategories || []
            ).map((sub, index) => (
              <option key={`${sub}-${index}`} value={sub}>
                {sub}
              </option>
            ))}
          </select>
          <label>תמונת התרומה:</label>
          <UploadImage onUploadImage={handleImageUpload} />
          <button type="submit" className="donationadd-submit">
            העלאה
          </button>
        </form>
      </div>
    </div>
  );
}

export default DonationAdd;
