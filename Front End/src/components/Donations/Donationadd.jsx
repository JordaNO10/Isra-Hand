import React, { useState, useEffect } from "react";
import Uploadimage from "./imageupload";
import "./css/donationadd.css";
import axios from "axios";

const Donationadd = ({ onAddDonation }) => {
  const [formData, setFormData] = useState({
    donationname: "",
    description: "",
    email: "",
    categoryId: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (imageFile) => {
    setSelectedFile(imageFile); // Store the actual file, not just the path
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.donationname ||
      !formData.description ||
      !formData.email ||
      !formData.categoryId ||
      !selectedFile // Ensure an image file is selected
    ) {
      alert("Please fill in all fields, including uploading an image.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("donationname", formData.donationname);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("categoryId", formData.categoryId);
    formDataToSend.append("image", selectedFile); // Append the actual file

    try {
      const response = await axios.post("/donationadd", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onAddDonation(response.data); // Update the donations list
      alert("Donation added successfully!");

      // Reset the form
      setFormData({
        donationname: "",
        description: "",
        email: "",
        categoryId: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to add donation:", error);
      alert("Failed to add donation. Please try again.");
    }
  };

  return (
    <div className="donation-container">
      <form className="donation-add" onSubmit={handleSubmit}>
        <label>: שם התרומה</label>
        <input
          type="text"
          name="donationname"
          value={formData.donationname}
          onChange={handleChange}
        />

        <label>: תיאור התרומה</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>: אימייל</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label>: קטגוריה</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
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
