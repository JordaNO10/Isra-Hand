import React, { useState } from "react";
import Uploadimage from "./imageupload";
import "../css/donationadd.css";

const Donationadd = ({ onAddDonation }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
  });

  // To store image data from UploadImage
  const [imageData, setImageData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload from the UploadImage component
  const handleImageUpload = (image) => {
    setImageData(image);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that all fields, including the image, are filled
    if (
      !formData.name ||
      !formData.description ||
      !formData.email ||
      !imageData
    ) {
      alert("Please fill in all fields, including uploading an image.");
      return; // Prevent form submission if fields are empty
    }

    // Create new donation object including image data if available
    const newDonation = {
      id: Date.now(),
      ...formData,
      image: imageData, // Add image data to donation
    };

    onAddDonation(newDonation); // Call parent function to add the donation
    alert("Donation added successfully!");

    // Reset form and image data after submission
    setFormData({
      name: "",
      description: "",
      email: "",
    });
    setImageData(null); // Clear the uploaded image
  };

  return (
    <form className="donation-add" onSubmit={handleSubmit}>
      <label>
        Donation Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Donation Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Donation Image Upload:
        <Uploadimage onUploadImage={handleImageUpload} />
      </label>
      <button className="submit-btn" type="submit">
        Submit
      </button>
    </form>
  );
};

export default Donationadd;
