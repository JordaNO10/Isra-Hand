import React from "react";
import Uploadimage from "./imageupload";
import { useDonationEditForm } from "./Helpers/useDonationForm";
import "./css/donationform.css";

function DonationForm({ editedData, onSave, onChange }) {
  const {
    temporaryImage,
    isModalOpen,
    errorMessage,
    handleChange,
    handleImageUpload,
    handleSubmit,
    handleBack,
    toggleModal,
  } = useDonationEditForm(editedData, onSave, onChange);

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
            src={editedData.donat_photo}
            alt="Current Donation"
            className="singlepage-image-preview"
            onClick={toggleModal}
            style={{ cursor: "pointer" }}
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
              }
              alt="Enlarged Donation"
            />
          </div>
        </div>
      )}
    </form>
  );
}

export default DonationForm;
