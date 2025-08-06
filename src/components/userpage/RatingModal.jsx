// src/RatingModal.jsx
import React, { useState } from "react";
import "./css/RatingModal.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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
      return toast.warning("📌 בחר דירוג לפני השליחה", {
        position: "top-center",
        autoClose: 2000,
      });
    }

    if (rating < 2 && comment.trim() === "") {
      return toast.error("אנא פרט מה הבעיה בתרומה", {
        position: "top-center",
        autoClose: 2500,
      });
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
      return toast.error("שליחת הדירוג נכשלה", {
        position: "top-center",
        autoClose: 2500,
      });
    }

    toast.success("✨ תודה על הדירוג!", {
      position: "top-center",
      autoClose: 2000,
    });

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
