import React from "react";

function DonationImageModal({ isOpen, onClose, image }) {
  if (!isOpen) return null;

  return (
    <div className="singlepage-modal" onClick={onClose}>
      <div
        className="singlepage-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="singlepage-close" onClick={onClose}>
          &times;
        </span>
        <img src={image} alt="Donation" className="singlepage-modal-image" />
      </div>
    </div>
  );
}

export default DonationImageModal;
