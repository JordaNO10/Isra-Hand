import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Uploadimage from "./imageupload";
import "./css/donationform.css";

function DonationForm({ editedData, onSave, onChange }) {
  const navigate = useNavigate();
  const [temporaryImage, setTemporaryImage] = useState(null); // State for new uploaded image
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...editedData, [name]: value }); // Update editedData
  };

  const handleImageUpload = (image) => {
    setTemporaryImage(image); // Set the temporary image for preview
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !editedData.donation_name ||
      !editedData.email ||
      !editedData.description
    ) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Prepare the data to be sent
    const updatedData = {
      ...editedData,
      image: temporaryImage || editedData.image, // Include the new image if available
    };

    onSave(updatedData); // Pass the updated data to the parent component
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <label>
        Name:
        <input
          type="text"
          name="donation_name"
          value={editedData.donation_name || ""}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={editedData.email || ""}
          onChange={handleChange}
        />
      </label>
      <label>
        Description:
        <textarea
          name="description"
          value={editedData.description || ""}
          onChange={handleChange}
        />
      </label>
      <label>
        Current Donation Image:
        {editedData.donat_photo && (
          <img
            src={editedData.donat_photo} // Show current image
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
            <img
              src={
                temporaryImage
                  ? URL.createObjectURL(temporaryImage)
                  : editedData.donat_photo
              } // Show new image if available, otherwise show current image
              alt="Enlarged Donation"
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default DonationForm;
