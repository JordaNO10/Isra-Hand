import React, { useState, useEffect } from "react"; // Import useEffect to fetch categories
import Uploadimage from "./imageupload";
import Map from "../Map/map"; // Import the Map component
import "./css/donationadd.css";

const Donationadd = ({ onAddDonation }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    categoryId: "", // Add categoryId to form data
  });

  const [imageData, setImageData] = useState(null);
  const [categories, setCategories] = useState([]); // State to hold categories

  useEffect(() => {
    // Fetch categories from the backend when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
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

  const handleImageUpload = (image) => {
    setImageData(image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.email ||
      !formData.categoryId || // Ensure categoryId is selected
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
        categoryId: "", // Reset categoryId
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

        <label>: שם התרומה</label>
        <input
          type="text"
          name="name"
          value={formData.name}
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
