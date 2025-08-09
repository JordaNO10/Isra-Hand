/**
 * מודל דירוג תרומה:
 * אוכף הערה כאשר הציון ≤ 2. שולח לשרת ושולח טוסט.
 */
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Stars from "./Stars";
import "../css/RatingModal.css";

const RatingModal = ({ onClose, onSubmit, donationId, requestorId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) return toast.warning("📌 בחר דירוג", { position:"top-center", autoClose:2000 });
    if (rating < 2 && !comment.trim()) return toast.error("נא לפרט מה הבעיה בתרומה", { position:"top-center", autoClose:2500 });

    try {
      await axios.post("/ratings",
        { rating, comment: comment.trim(), donation_id: donationId, user_id: requestorId },
        { withCredentials: true }
      );
      toast.success("✨ תודה על הדירוג!", { position:"top-center", autoClose:2000 });
      onSubmit?.(rating, comment);
      onClose();
    } catch {
      toast.error("שליחת הדירוג נכשלה", { position:"top-center", autoClose:2500 });
    }
  };

  return (
    <div className="rating-modal-backdrop">
      <div className="rating-modal">
        <h3>דרג את התרומה</h3>
        <Stars value={rating} onChange={(v) => { setRating(r => r===v ? 0 : v); if (v>=2) setComment(""); }} />
        {rating > 0 && rating <= 2 && (
          <textarea placeholder="מה הייתה הבעיה בתרומה?" value={comment} onChange={(e)=>setComment(e.target.value)} />
        )}
        <div className="modal-actions">
          <button onClick={handleSubmit}>שלח</button>
          <button onClick={onClose} className="cancel">ביטול</button>
        </div>
      </div>
    </div>
  );
};
export default RatingModal;
