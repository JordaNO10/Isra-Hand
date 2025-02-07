import React, { useState } from "react";
import "./css/imageupload.css";

const Uploadimage = ({ onUploadImage }) => {
  const [imageData, setImageData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [error, setError] = useState(""); // State for error messages

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, or GIF).");
        return;
      }

      setError(""); // Reset error message
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageData(reader.result); // Save base64 image to state
        onUploadImage(reader.result); // Pass image to parent component
      };

      reader.readAsDataURL(file); // Convert the image to base64
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Display error message */}
      {imageData && (
        <div className="imageupload-image">
          <h3>Uploaded Image Preview:</h3>
          <img
            src={imageData}
            alt="Uploaded Preview"
            onClick={toggleModal} // Open modal on click
            style={{ cursor: "pointer" }} // Change cursor to pointer
          />
        </div>
      )}
      {/* Modal for displaying the enlarged uploaded image */}
      {isModalOpen && (
        <div className="image-modal" onClick={toggleModal}>
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="close"
              onClick={toggleModal}
              aria-label="Close modal"
            >
              &times;
            </span>
            <img src={imageData} alt="Enlarged Uploaded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Uploadimage;
