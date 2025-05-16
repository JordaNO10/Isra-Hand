import React, { useState } from "react";
import "./css/RatingModal.css";

const RatingModal = ({ onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarClick = (value) => {
    setRating(value);
    if (value >= 2) setComment(""); // Clear comment if rating is good
  };

  const handleSubmit = () => {
    if (rating === 0) return alert("בחר דירוג לפני שליחה");
    onSubmit(rating, comment);
  };

  return (
    <div className="rating-modal-backdrop">
      <div className="rating-modal">
        <h3>דרג את התרומה</h3>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((val) => (
            <span
              key={val}
              onClick={() => handleStarClick(val)}
              className={rating >= val ? "star selected" : "star"}
            >
              ★
            </span>
          ))}
        </div>

        {rating < 2 && (
          <textarea
            placeholder="מה הייתה הבעיה בתרומה?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}

        <div className="modal-actions">
          <button onClick={handleSubmit}>שלח</button>
          <button onClick={onClose} className="cancel">
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
