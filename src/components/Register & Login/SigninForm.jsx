// src/Register & Login/SigninForm.jsx
import React, { useState } from "react";
import { useDropdownSigninHelpers } from "./Helpers/useDropdownSigninHelpers";
import { useAuthHelpers } from "./Helpers/useAuthHelpers";
import { useNavigate } from "react-router-dom";
import "./css/signin.css";

const SigninForm = ({ setShowForm, handleLoginSuccess }) => {
  const {
    formData,
    errorMessage,
    handleInputChange,
    handleSubmit,
    resendVerificationEmail,
  } = useDropdownSigninHelpers(setShowForm, handleLoginSuccess);

  const [emailForReset, setEmailForReset] = useState("");
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();
  const [resendSuccess, setResendSuccess] = useState(false);

  const { handleForgotPassword, errorMessage: resetError } =
    useAuthHelpers(navigate);

  const handleReset = (e) => {
    e.preventDefault();
    if (!emailForReset) return alert("יש להזין אימייל");
    handleForgotPassword(emailForReset);
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <h2 className="signInForm">התחברות</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {errorMessage?.toLowerCase().includes("verify your email") && (
        <>
          <button
            type="button"
            className="resend-btn"
            onClick={async () => {
              try {
                await resendVerificationEmail();
                setResendSuccess(true);
              } catch (err) {
                setResendSuccess(false);
              }
            }}
            style={{
              marginBottom: "0.5rem",
              backgroundColor: "#f0f2f5",
              color: "#1877f2",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            שלח שוב את מייל האימות
          </button>

          {resendSuccess && (
            <div
              style={{
                color: "green",
                marginTop: "0.25rem",
                fontWeight: "bold",
              }}
            >
              ✅ אימייל אימות נשלח בהצלחה
            </div>
          )}
        </>
      )}
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
      <div className="forgot-password-section">
        {!showReset ? (
          <p
            className="forgot-password-link"
            onClick={() => setShowReset(true)}
            style={{
              cursor: "pointer",
              marginTop: "1rem",
              textAlign: "center",
            }}
          >
            שכחת סיסמה?
          </p>
        ) : (
          <div className="reset-form">
            <input
              type="email"
              placeholder="הזן את האימייל לאיפוס"
              value={emailForReset}
              onChange={(e) => setEmailForReset(e.target.value)}
            />
            <button onClick={handleReset} className="signin-btn" type="button">
              שלח קישור איפוס
            </button>
            {resetError && <div className="error-message">{resetError}</div>}
          </div>
        )}
      </div>
    </form>
  );
};

export default SigninForm;
