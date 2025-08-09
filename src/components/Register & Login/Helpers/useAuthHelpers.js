// src/Helpers/useAuthHelpers.js
/**
 * מודול עזר להרשמה ואיפוס סיסמה.
 * אחראי על: בניית בקשות לשרת, טיפול בשגיאות, וטוסטים ידידותיים.
 * התאמה לעדכון: אין שליחת role_id ב-signup (השרת מקצה אוטומטית role_id=2).
 */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** הצגת שגיאה מרוכזת כטוסט + עדכון סטייט */
const showError = (msg, setError) => {
  setError(msg);
  toast.error(msg, { autoClose: 8000 });
};

/** בדיקת חוזק סיסמה (מקבל בוליאן שכבר חושב ברכיב) */
const validatePasswordStrength = (passwordValid, setError) => {
  if (!passwordValid) {
    showError("הסיסמה לא עומדת בדרישות.", setError);
    return false;
  }
  return true;
};

/** בניית FormData סטנדרטי לבקשות multipart */
const buildFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

export const useAuthHelpers = (navigate) => {
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * שינוי ערכי טופס חיצוני
   * @param {Event} e
   * @param {Object} formData  - אובייקט ערכי הטופס הנוכחיים
   * @param {Function} setFormData - סטייט לטופס
   */
  const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * הרשמה – ללא שליחת role_id (השרת יקבע role_id=2)
   * @param {Object} signupPayload - { username, full_name, email, password, birth_date }
   * @param {boolean} passwordValid - האם הסיסמה עומדת בתנאים שהוגדרו
   */
  const handleSignup = async (signupPayload, passwordValid) => {
    if (!validatePasswordStrength(passwordValid, setErrorMessage)) return;

    try {
      const res = await axios.post("/users/register", buildFormData(signupPayload), {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 201) {
        setErrorMessage("");
        toast.success("הרשמה בוצעה בהצלחה. אנא אמת/י את כתובת האימייל כדי להתחבר.", {
          autoClose: 8000,
        });
        navigate("/Signin");
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message || "שגיאה בהרשמה";
      showError(errMsg, setErrorMessage);
    }
  };

  /**
   * שליחת קישור איפוס סיסמה
   * @param {string} email - אימייל היעד
   */
  const handleForgotPassword = async (email) => {
    try {
      const { data } = await axios.post(
        "/users/forgot-password",
        { email },
        { withCredentials: true }
      );
      toast.success(data?.message || "קישור איפוס נשלח למייל", { autoClose: 8000 });
      setErrorMessage("");
      navigate("/Signin");
    } catch (error) {
      const errMsg = error?.response?.data?.error || "שגיאה בשליחת קישור איפוס";
      showError(errMsg, setErrorMessage);
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
