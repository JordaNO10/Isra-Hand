import React, { useEffect, useState } from "react";

function DonationImageModal({ isOpen, onClose, image }) {
  const [isLoading, setIsLoading] = useState(true);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="singlepage-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="singlepage-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="singlepage-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </span>
        {isLoading && <div className="loading-spinner">Loading...</div>}
        <img
          src={image}
          alt="Donation"
          className="singlepage-modal-image"
          onLoad={() => setIsLoading(false)}
          style={isLoading ? { display: "none" } : {}} // Hide image until it has loaded
        />
      </div>
    </div>
  );
}

export default DonationImageModal;
