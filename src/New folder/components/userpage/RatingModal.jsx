import React, { useState } from "react";
import "./css/RatingModal.css";
import axios from "axios";
import Cookies from "js-cookie";

const RatingModal = ({ onClose, onSubmit, donationId, requestorId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const userId = Cookies.get("userId");
  const handleStarClick = (value) => {
    setRating((prev) => (prev === value ? 0 : value)); // Toggle
    if (value >= 2) setComment("");
  };

 const handleSubmit = async () => {
  if (rating === 0) {
    return alert("בחר דירוג לפני שליחה");
  }

  if (rating < 2 && comment.trim() === "") {
    return alert("אנא פרט מה הבעיה בתרומה");
  }

  try {
    await axios.post(
      "/ratings",
      {
        rating: rating,
        comment: comment.trim(),
        donation_id: donationId,
        user_id: requestorId,
      },
      { withCredentials: true }
    );
  } catch (err) {
    console.error("Error submitting rating:", err);
    return alert("שליחת הדירוג נכשלה");
  }

  // ✅ Only runs if axios succeeds
  alert("תודה על הדירוג!");
  if (onSubmit) onSubmit(rating, comment); // defensive call
  onClose();
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

        {rating > 0 && rating <= 2 && (
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
