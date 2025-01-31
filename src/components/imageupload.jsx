import React, { useState } from "react";
import "../css/imageupload.css";
const Uploadimage = ({ onUploadImage }) => {
  const [imageData, setImageData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
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
      {imageData && (
        <div>
          <h3>Uploaded Image Preview:</h3>
          <img
            src={imageData}
            alt="Uploaded Preview"
            style={{ maxWidth: "15vw", cursor: "pointer" }} // Change cursor to pointer
            onClick={toggleModal} // Open modal on click
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
            <span className="close" onClick={toggleModal}>
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
