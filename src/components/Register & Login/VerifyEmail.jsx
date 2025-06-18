// src/VerifyEmail.jsx
import React from "react";
import { useVerifyEmail } from "./Helpers/useVerifyEmail";
import "./css/verifyemail.css"; // ניצור עוד רגע

const VerifyEmail = () => {
  const { message } = useVerifyEmail();

  return (
    <div className="verify-email-container">
      <div className="toast">{message}</div>
    </div>
  );
};

export default VerifyEmail;
