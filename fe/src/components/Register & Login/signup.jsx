// src/Register & Login/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthHelpers } from "./Helpers/useAuthHelpers";
import "./css/signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const { errorMessage, setErrorMessage, handleInputChange, handleSignup } =
    useAuthHelpers(navigate);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    roleId: "",
  });

  // Password Validation
  const passwordValidations = {
    minLength: formData.password.length >= 8,
    hasNumber: /\d/.test(formData.password),
    hasUpperCase: /[A-Z]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("הסיסמאות אינן תואמות");
      return;
    }

    await handleSignup(formData, isPasswordValid);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>הרשמה ל-IsraHand</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <input
          type="text"
          name="username"
          placeholder="שם משתמש"
          value={formData.username}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        <input
          type="text"
          name="firstName"
          placeholder="שם פרטי"
          value={formData.firstName}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="שם משפחה"
          value={formData.lastName}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        <input
          type="date"
          name="birthday"
          placeholder="תאריך לידה"
          value={formData.birthday}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        <select
          name="roleId"
          value={formData.roleId}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        >
          <option value="" disabled>
            בחר סוג משתמש
          </option>
          <option value="2">תורם</option>
          <option value="3">מבקש</option>
        </select>

        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        {/* Password Guidelines */}
        <div className="password-guidelines">
          <div className={passwordValidations.minLength ? "valid" : "invalid"}>
            לפחות 8 תווים
          </div>
          <div className={passwordValidations.hasNumber ? "valid" : "invalid"}>
            לפחות ספרה אחת
          </div>
          <div
            className={passwordValidations.hasUpperCase ? "valid" : "invalid"}
          >
            לפחות אות גדולה אחת
          </div>
        </div>

        <input
          type="password"
          name="confirmPassword"
          placeholder="אשר סיסמה"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange(e, formData, setFormData)}
          required
        />

        <button type="submit" className="signup-btn">
          הרשם
        </button>

        <div className="additional-links">
          <Link to="/Signin" className="additional-link">
            יש לך חשבון? התחבר כאן
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
