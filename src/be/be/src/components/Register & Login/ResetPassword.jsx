// src/Register & Login/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/signin.css"; // reuse signin style for consistency

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("הסיסמאות אינן תואמות");
      return;
    }

    try {
      await axios.post(`/users/reset-password/${token}`, { password });
      alert("הסיסמה אופסה בהצלחה! כעת תוכל להתחבר.");
      navigate("/Signin");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "שגיאה באיפוס הסיסמה");
    }
  };

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

        <button type="submit" className="signin-btn">
          אפס סיסמה
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
