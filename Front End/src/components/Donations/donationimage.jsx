import React, { useEffect, useState } from "react";

function DonationImageModal({ isOpen, onClose, image }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false); // State to track image loading errors

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
      aria-labelledby="modal-title"
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
        {!hasError && (
          <img
            src={image}
            alt="Donation"
            className="singlepage-modal-image"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false); // Stop loading on error
            }}
            style={isLoading ? { display: "none" } : {}}
          />
        )}
        {hasError && <p className="error-message">Failed to load image.</p>}{" "}
        {/* Error message for image loading failures */}
      </div>
    </div>
  );
}

export default DonationImageModal;
