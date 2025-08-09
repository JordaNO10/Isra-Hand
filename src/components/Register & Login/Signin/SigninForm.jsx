/**
 * טופס התחברות קומפקטי (לדרופדאון/מקומות נוספים)
 * כולל שליחת אימייל אימות מחדש + לינק איפוס inline.
 */
import React, { useState } from "react";
import { useDropdownSigninHelpers } from "../Helpers/useDropdownSigninHelpers";
import "../css/signin.css";
import ResetInline from "./ResetInline";

const SigninForm = ({ setShowForm, handleLoginSuccess }) => {
  const {
    formData, errorMessage, handleInputChange, handleSubmit, resendVerificationEmail,
  } = useDropdownSigninHelpers(setShowForm, handleLoginSuccess);

  const [showReset, setShowReset] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <h2 className="signInForm">התחברות</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {errorMessage === "אנא אמת את כתובת האימייל שלך" && (
        <>
          <button type="button" className="resend-btn"
            onClick={async () => {
              try { await resendVerificationEmail(); setResendSuccess(true); }
              catch { setResendSuccess(false); }
            }}>
            שלח שוב את מייל האימות
          </button>
          {resendSuccess && <div style={{ color:"green", marginTop:"0.25rem", fontWeight:"bold" }}>
            ✅ אימייל אימות נשלח בהצלחה
          </div>}
        </>
      )}

      <input type="text" name="emailOrUsername" placeholder="אימייל או שם משתמש"
             value={formData.emailOrUsername} onChange={handleInputChange} required />
      <input type="password" name="password" placeholder="סיסמה"
             value={formData.password} onChange={handleInputChange} required />

      <button type="submit" className="signin-btn">התחבר</button>

      <div className="forgot-password-section">
        {!showReset ? (
          <p className="forgot-password-link" onClick={() => setShowReset(true)}>
            שכחת סיסמה?
          </p>
        ) : (
          <ResetInline />
        )}
      </div>
    </form>
  );
};

export default SigninForm;
