// src/Helpers/useAuthHelpers.js
/**
 * עזרי הרשמה/שכחתי סיסמה:
 * ניהול שגיאות, איסוף נתונים, שליחת בקשות לשרת והצגת טוסטים.
 */
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// בדיקת חוזק סיסמה (כבר בוצע אצלך לפני הקריאה – זה רק מסר לשימוש חוזר)
const validatePasswordStrength = (passwordValid, setError) => {
  if (!passwordValid) {
    setError("הסיסמה לא עומדת בדרישות.");
    toast.error("הסיסמה לא עומדת בדרישות.", { autoClose: 8000 });
    return false;
  }
  return true;
};

// בניית FormData לבקשה
const buildFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => fd.append(k, v));
  return fd;
};

export const useAuthHelpers = (navigate) => {
  const [errorMessage, setErrorMessage] = useState("");

  /** שינוי שדה בטופס חיצוני (מקבל סטייט חיצוני) */
  const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /** הרשמה */
  const handleSignup = async (formData, passwordValid) => {
    if (!validatePasswordStrength(passwordValid, setErrorMessage)) return;

    try {
      const res = await axios.post("/users/register", buildFormData(formData), {
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
      setErrorMessage(errMsg);
      toast.error(errMsg, { autoClose: 8000 });
    }
  };

  /** שליחת קישור איפוס סיסמה */
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
      setErrorMessage(errMsg);
      toast.error(errMsg, { autoClose: 8000 });
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
