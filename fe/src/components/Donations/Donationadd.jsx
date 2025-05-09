import React from "react";
import { useNavigate } from "react-router-dom";
import { useDonationAddForm } from "./Helpers/useDonationForm";
import UploadImage from "./imageupload";
import "./css/donationadd.css";

function DonationAdd() {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    categories,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
  } = useDonationAddForm(navigate);

  return (
    <section className="donationadd-section">
      <form className="donationadd-form" onSubmit={handleSubmit}>
        <h2>הוספת תרומה חדשה</h2>

        <label htmlFor="donation_name">שם התרומה:</label>
        <input
          type="text"
          name="donation_name"
          value={formData.donation_name}
          onChange={handleInputChange}
        />

        <label htmlFor="email">אימייל:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <label htmlFor="description">תיאור התרומה:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        ></textarea>

        <label htmlFor="category_id">בחר קטגוריה:</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
        >
          <option value="" disabled>
            בחר קטגוריה
          </option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <label>העלה תמונה:</label>
        <UploadImage onUploadImage={handleImageUpload} />

        <button type="submit" className="donationadd-submit">
          הוסף תרומה
        </button>
      </form>
    </section>
  );
}

export default DonationAdd;
