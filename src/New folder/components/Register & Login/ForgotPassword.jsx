// src/Register & Login/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthHelpers } from "./Helpers/useAuthHelpers";
import "./css/signin.css"; // We reuse the signin style here

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { errorMessage, setErrorMessage, handleForgotPassword } =
    useAuthHelpers(navigate);

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("נא להכניס אימייל.");
      return;
    }

    await handleForgotPassword(email);
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>שחזור סיסמה</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <input
          type="email"
          name="email"
          placeholder="הכנס את האימייל שלך"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="signin-btn">
          שלח קישור איפוס
        </button>

        <div className="additional-links">
          <button
            type="button"
            className="additional-link"
            onClick={() => navigate("/Signin")}
          >
            חזור להתחברות
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
