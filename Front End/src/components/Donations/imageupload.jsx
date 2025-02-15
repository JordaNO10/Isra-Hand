import React, { useState } from "react";
import "./css/imageupload.css";

const Uploadimage = ({ onUploadImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        setError("Please upload a valid image (JPEG, PNG, or GIF).");
        return;
      }

      setError(""); // Reset error message
      setSelectedFile(file); // Save file for preview

      // Pass the file to the parent component for handling in form submission
      onUploadImage(file);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {error && <p className="error-message">{error}</p>}

      {selectedFile && (
        <div className="imageupload-image">
          <h3>Image Preview:</h3>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            onClick={toggleModal}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}

      {isModalOpen && selectedFile && (
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
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Enlarged Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Uploadimage;
