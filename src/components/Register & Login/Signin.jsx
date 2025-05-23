// src/Register & Login/Signin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthHelpers } from "./Helpers/useAuthHelpers";
import "./css/signin.css";

const Signin = () => {
  const navigate = useNavigate();
  const { errorMessage, setErrorMessage, handleInputChange, handleSignin } =
    useAuthHelpers(navigate);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSignin(formData);
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>ברוך הבא ל-IsraHand</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        <button type="submit" className="signin-btn">
          התחבר
        </button>

        <div className="additional-links">
          <Link to="/Signup" className="additional-link">
            אין לך חשבון? הרשם כאן
          </Link>
          <Link to="/ForgotPassword" className="additional-link">
            שכחת סיסמה?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
