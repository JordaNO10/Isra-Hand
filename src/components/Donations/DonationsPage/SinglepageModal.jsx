/**
 * מעטפת מודל להצגת Singlepage בתוך רשימת תרומות.
 */
import Singlepage from "../Singlepage/singlePage";

const SinglepageModal = ({ open, onClose, donationId }) => !open ? null : (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-modal" onClick={onClose}>✖</button>
      <Singlepage donationId={donationId} />
    </div>
  </div>
);
export default SinglepageModal;
