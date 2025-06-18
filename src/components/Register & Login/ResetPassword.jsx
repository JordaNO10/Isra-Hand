// src/Register & Login/ResetPassword.jsx
import React from "react";
import { useParams } from "react-router-dom";
import "./css/signin.css";
import { useResetPassword } from "./Helpers/useResetPassword";

const ResetPassword = () => {
  const { token } = useParams();
  const {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    loading,
    errorMessage,
  } = useResetPassword(token);

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>איפוס סיסמה</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <input
          type="password"
          placeholder="סיסמה חדשה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="אשר סיסמה חדשה"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" className="signin-btn" disabled={loading}>
          {loading ? "שולח..." : "אפס סיסמה"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
