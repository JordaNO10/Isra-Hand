import React, { useEffect, useState } from "react";
import "./css/singlepage.css"; // Ensure you have the necessary CSS styles

function DonationImageModal({ isOpen, onClose, image }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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

  // Reset loading and error states when the image changes
  useEffect(() => {
    if (image) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [image]);

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
          tabIndex={0} // Make the close button focusable
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
        >
          &times;
        </span>

        {/* Show loading spinner while the image is loading */}
        {isLoading && <div className="loading-spinner">Loading...</div>}

        {/* Show the image if it exists and has no errors */}
        {!hasError && image && (
          <img
            src={image}
            alt="Donation"
            className="singlepage-modal-image"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            style={isLoading ? { display: "none" } : {}}
          />
        )}

        {/* Show an error message if the image fails to load or is invalid */}
        {hasError && <p className="error-message">Failed to load image.</p>}

        {/* Show a fallback message if the image is undefined or null */}
        {!image && <p className="error-message">No image available.</p>}
      </div>
    </div>
  );
}

export default DonationImageModal;
