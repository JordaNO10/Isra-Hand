import React from "react";
import { useNavigate } from "react-router-dom";
import Uploadimage from "./imageupload";
import { useDonationAddForm } from "./Helpers/useDonationForm";
import "./css/donationadd.css";

const Donationadd = () => {
  const navigate = useNavigate();
  const {
    formData,
    categories,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
  } = useDonationAddForm(navigate);

  return (
    <div className="donation-container">
      <form className="donation-addForm" onSubmit={handleSubmit}>
        <label>: שם התרומה</label>
        <input
          type="text"
          name="donationname"
          value={formData.donationname}
          onChange={handleInputChange}
        />

        <label>: תיאור התרומה</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />

        <label>: אימייל</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <label>: קטגוריה</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>

        <label>Donation Image Upload:</label>
        <div className="image-upload">
          <Uploadimage onUploadImage={handleImageUpload} />
        </div>

        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Donationadd;
