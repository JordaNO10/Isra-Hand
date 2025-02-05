import React, { useState } from "react";
import Uploadimage from "./imageupload";
import Map from "./map"; // Import the Map component
import "../css/donationadd.css";

const Donationadd = ({ onAddDonation }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
  });

  const [imageData, setImageData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (image) => {
    setImageData(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.email ||
      !imageData
    ) {
      alert("Please fill in all fields, including uploading an image.");
      return;
    }

    // Create a new donation object
    const newDonation = {
      ...formData,
      image: imageData,
    };

    // Send the donation data to the backend
    const response = await fetch("/api/donate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDonation),
    });

    if (response.ok) {
      const savedDonation = await response.json();
      onAddDonation(savedDonation); // Call the parent function to update the donations list
      alert("Donation added successfully!");

      // Reset the form
      setFormData({
        name: "",
        description: "",
        email: "",
      });
      setImageData(null);
    } else {
      alert("Failed to add donation. Please try again.");
    }
  };

  return (
    <div className="donation-container">
      <form className="donation-add" onSubmit={handleSubmit}>
        {imageData && <Map imageUrl={imageData} onSelectLocation={() => {}} />}

        <label>Donation Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label>Donation Description:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

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
