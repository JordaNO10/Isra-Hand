/**
 * מודל תצוגת תמונת תרומה (כולל מצב טעינה ושגיאה).
 */
import "../css/singlepage.css";
import { useDonationImageModal } from "../Helpers/useDonationImage";

function DonationImageModal({ isOpen, onClose, image }) {
  const { isLoading, hasError, handleLoad, handleError } =
    useDonationImageModal(isOpen, image, onClose);

  if (!isOpen) return null;

  return (
    <div className="singlepage-modal" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="singlepage-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="singlepage-close" onClick={onClose} aria-label="Close modal" tabIndex={0}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClose()}>
          &times;
        </span>

        {isLoading && <div className="loading-spinner">Loading...</div>}

        {!hasError && image && (
          <img
            src={image}
            alt="Donation"
            className="singlepage-modal-image"
            onLoad={handleLoad}
            onError={handleError}
            style={isLoading ? { display: "none" } : {}}
          />
        )}

        {hasError && <p className="error-message">Failed to load image.</p>}
        {!image && <p className="error-message">No image available.</p>}
      </div>
    </div>
  );
}
export default DonationImageModal;
