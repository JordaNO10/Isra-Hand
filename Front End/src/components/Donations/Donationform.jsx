import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Uploadimage from "./imageupload";
import "./css/donationform.css"; // Only use the single page styles now

function DonationForm({ editedData, onSave, onChange }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const [temporaryImage, setTemporaryImage] = useState(null); // State for temporary image
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const handleChange = (e) => {
    onChange({ ...editedData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (image) => {
    setTemporaryImage(image); // Set the temporary image without updating editedData
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!editedData.name || !editedData.email || !editedData.description) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Only update the image in editedData if a temporary image is set
    const updatedData = {
      ...editedData,
      image: temporaryImage || editedData.image,
    };

    onSave(updatedData);
    setErrorMessage(""); // Clear error message on successful submission
  };

  const handleBack = () => {
    navigate("/donations"); // Navigate to the donations page
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  return (
    <form onSubmit={handleSubmit} className="singlepage-form">
      {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
      {/* Display error message */}
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={editedData.name}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={editedData.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={editedData.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Current Donation Image:
        {editedData.image && (
          <img
            src={editedData.image} // Show current image
            alt="Current Donation"
            className="singlepage-image-preview"
            onClick={toggleModal} // Open modal on click
            style={{ cursor: "pointer" }} // Change cursor to pointer
          />
        )}
      </label>
      <div className="donationform-imageUpload">
        <Uploadimage onUploadImage={handleImageUpload} />
      </div>
      <div className="singlepage-button-group">
        <button
          type="button"
          onClick={handleBack}
          className="singlepage-go-btn"
        >
          Back
        </button>
        <button type="submit" className="singlepage-submit-btn">
          Save
        </button>
      </div>
      {/* Modal for displaying the enlarged image */}
      {isModalOpen && (
        <div className="image-modal" onClick={toggleModal}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <img src={editedData.image} alt="Enlarged Donation" />
          </div>
        </div>
      )}
    </form>
  );
}

export default DonationForm;
