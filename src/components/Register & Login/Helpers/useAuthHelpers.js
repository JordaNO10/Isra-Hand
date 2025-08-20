/**
 * מודול עזר להרשמה ואיפוס סיסמה.
 * כולל: בניית בקשות לשרת, טיפול בשגיאות, וטוסטים ידידותיים.
 * הערה: אין שליחת role_id ב-signup (השרת מקצה אוטומטית role_id=2).
 */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// הצגת שגיאה כטוסט + עדכון סטייט
const showError = (msg, setError) => {
  setError(msg);
  toast.error(msg, { autoClose: 8000 });
};

// בדיקת חוזק סיסמה (מקבל בוליאן שכבר חושב ברכיב)
const validatePasswordStrength = (passwordValid, setError) => {
  if (!passwordValid) {
    showError("הסיסמה לא עומדת בדרישות.", setError);
    return false;
  }
  return true;
};

// בניית FormData סטנדרטי לבקשות multipart
const buildFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

export const useAuthHelpers = (navigate) => {
  const [errorMessage, setErrorMessage] = useState("");

  // שינוי ערכי טופס חיצוני
  const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // הרשמה – ללא שליחת role_id (השרת יקבע role_id=2)
  const handleSignup = async (signupPayload, passwordValid) => {
    if (!validatePasswordStrength(passwordValid, setErrorMessage)) return;

    try {
      const res = await axios.post("/users/register", buildFormData(signupPayload), {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        setErrorMessage("");
        toast.success("הרשמה בוצעה בהצלחה. יש לאמת אימייל לפני התחברות.", {
          autoClose: 8000,
        });
        navigate("/Signin");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "שגיאה בהרשמה";
      showError(errMsg, setErrorMessage);
    }
  };

  // שליחת קישור איפוס סיסמה למייל
  const handleForgotPassword = async (email, { silent = false } = {}) => {
    try {
      const { data } = await axios.post(
        "/users/forgot-password",
        { email },
        { withCredentials: true }
      );

      const msg = data?.message || "אימייל איפוס נשלח";
      if (!silent) toast.success(msg, { autoClose: 2500 });

      return { success: true, message: msg };
    } catch (error) {
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "שגיאה בשליחת קישור איפוס";

      if (!silent) toast.error(errMsg, { autoClose: 3500 });

      return { success: false, message: errMsg };
    }
  };

  return {
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleSignup,
    handleForgotPassword,
  };
};
