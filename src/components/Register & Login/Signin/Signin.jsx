/**
 * דף התחברות מלא (לא בתוך דרופדאון)
 */
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDropdownSigninHelpers } from "../Helpers/useDropdownSigninHelpers";
import "../css/signin.css";

const Signin = () => {
  const navigate = useNavigate();
  const {
    formData,
    errorMessage,
    handleInputChange,
    handleSubmit,
    resendVerificationEmail,
  } = useDropdownSigninHelpers(() => {}, 
  
);
  const [resendSuccess, setResendSuccess] = useState(false);

  return (
    <div className="signin-container">
      <form className="signin-form standalone" onSubmit={handleSubmit}>
        <h2>IsraHand - ברוך הבא</h2>

 {errorMessage && <div className="error-message">{errorMessage}</div>}

        {errorMessage === "אנא אמת את כתובת האימייל שלך" && (
          <>
            <button
              type="button"
              className="resend-btn"
              onClick={async () => {
                try {
                  await resendVerificationEmail();
                  setResendSuccess(true);
                } catch {
                  setResendSuccess(false);
                }
              }}
            >
              שלח שוב את מייל האימות
            </button>
            {resendSuccess && (
              <div style={{ color: "green", marginTop: "0.25rem", fontWeight: "bold" }}>
                ✅ אימייל אימות נשלח בהצלחה
              </div>
            )}
          </>
        )}

        <input type="text" name="emailOrUsername" placeholder="אימייל או שם משתמש"
               value={formData.emailOrUsername} onChange={handleInputChange} required />
        <input type="password" name="password" placeholder="סיסמה"
               value={formData.password} onChange={handleInputChange} required />

        <button type="submit" className="signin-btn">התחבר</button>

        <div className="additional-links">
          <Link to="/Signup" className="additional-link">אין לך חשבון? הרשם כאן</Link>
          <Link to="/ForgotPassword" className="additional-link">שכחת סיסמה?</Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
