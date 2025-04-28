// src/Register & Login/SigninForm.jsx
import React from "react";
import { useDropdownSigninHelpers } from "./Helpers/useDropdownSigninHelpers";
import "./css/signin.css";

const SigninForm = ({ setShowForm, handleLoginSuccess }) => {
  const { formData, errorMessage, handleInputChange, handleSubmit } =
    useDropdownSigninHelpers(setShowForm, handleLoginSuccess);

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <h2 className="signInForm">התחברות</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <input
        type="email"
        name="email"
        placeholder="אימייל"
        value={formData.email}
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
    </form>
  );
};

export default SigninForm;
