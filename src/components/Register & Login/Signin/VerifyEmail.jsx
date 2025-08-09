/**
 * מסך אימות מייל: מציג הודעת הצלחה/כישלון לפי תגובת השרת.
 */
import React from "react";
import { useVerifyEmail } from "../Helpers/useVerifyEmail";
import "../css/verifyemail.css";

const VerifyEmail = () => {
  const { message } = useVerifyEmail();
  return (
    <div className="verify-email-container">
      <div className="toast">{message}</div>
    </div>
  );
};

export default VerifyEmail;
