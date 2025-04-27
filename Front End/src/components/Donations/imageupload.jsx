import React from "react";
import { useImageUpload } from "./Helpers/useDonationImage";
import "./css/imageupload.css";

const Uploadimage = ({ onUploadImage }) => {
  const { selectedFile, isModalOpen, error, handleFileChange, toggleModal } =
    useImageUpload(onUploadImage);

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
