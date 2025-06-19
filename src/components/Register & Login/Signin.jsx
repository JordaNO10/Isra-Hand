// src/Register & Login/Signin.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDropdownSigninHelpers } from "./Helpers/useDropdownSigninHelpers";
import "./css/signin.css";

const Signin = () => {
  const navigate = useNavigate();

  const {
    formData,
    setFormData,
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleSubmit,
  } = useDropdownSigninHelpers(
    () => {}, // Dummy setShowForm
    () => navigate("/") // Redirect after login
  );

  return (
    <div className="signin-container">
      <form className="signin-form standalone" onSubmit={handleSubmit}>
        <h2>ברוך הבא ל-IsraHand</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <input
          type="text"
          name="emailOrUsername"
          placeholder="אימייל או שם משתמש"
          value={formData.emailOrUsername}
          onChange={handleInputChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleInputChange}
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
