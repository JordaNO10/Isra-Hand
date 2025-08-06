// src/Register & Login/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthHelpers } from "./Helpers/useAuthHelpers";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/signin.css";

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

    const success = await handleForgotPassword(email);

    // ✅ אם הצליח – הצג toast
    if (success) {
      toast.success("קישור איפוס נשלח למייל שלך!");
    }
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

      {/* ✅ הצגת ה-toast */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ForgotPassword;
