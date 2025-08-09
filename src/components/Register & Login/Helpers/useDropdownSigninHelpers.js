// src/Helpers/useDropdownSigninHelpers.js
/**
 * עזרי התחברות (דרופדאון/מסכים):
 * אחראי על שינוי שדות, שליחת התחברות, ושליחת מייל אימות מחדש.
 * נשמר אותו API: formData, setFormData, errorMessage, setErrorMessage,
 * handleInputChange, handleSubmit, resendVerificationEmail
 */
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ולידציה בסיסית לטופס
const validateFormData = (formData, setErrorMessage) => {
  if (!formData.emailOrUsername || !formData.password) {
    setErrorMessage("אנא מלא/י את כל השדות");
    return false;
  }
  return true;
};

// שמירת קוקיות מהתשובה
const saveCookiesFromLogin = (data) => {
  Cookies.set("userId", data.userId);
  Cookies.set("userRole", data.roleId);
  // תומך בשם מלא בפורמטים שונים מהשרת
  Cookies.set("fullName", data.fullName || data.full_name || "");
};

// ניווט לפי תפקיד
const navigateByRole = (navigate, roleId) => {
  if (String(roleId) === "1") navigate("/admin");
  else {
    navigate("/");
    window.location.reload();
  }
};

// טיפול בהודעות שגיאה מהשרת
const handleServerError = (error, setErrorMessage) => {
  const serverMsg = error?.response?.data?.error || error?.response?.data?.message;
  if (serverMsg === "אנא אמת את כתובת האימייל שלך") {
    setErrorMessage("אנא אמת את כתובת האימייל שלך");
  } else {
    setErrorMessage(serverMsg || "שגיאה בהתחברות");
  }
};

export const useDropdownSigninHelpers = (setShowForm, handleLoginSuccess) => {
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  /** שינוי שדה קלט */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** שליחת אימייל אימות מחדש */
  const resendVerificationEmail = async () => {
    try {
      const res = await axios.post(
        "/users/resend-verification",
        { emailOrUsername: formData.emailOrUsername },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      // נזרוק הלאה כדי שהקורא יחליט מה להציג
      throw err;
    }
  };

  /** שליחת התחברות */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData(formData, setErrorMessage)) return;

    try {
      const { data, status } = await axios.post(
        "/users/login",
        { emailOrUsername: formData.emailOrUsername, password: formData.password },
        { withCredentials: true }
      );

      if (status === 200) {
        saveCookiesFromLogin(data);
        setErrorMessage("");
        setShowForm && setShowForm(false);

        toast.success("מתחבר לחשבון...", {
          position: "top-center",
          autoClose: 1500,
          pauseOnHover: false,
        });

        setTimeout(() => {
          navigateByRole(navigate, data.roleId);
          handleLoginSuccess && handleLoginSuccess();
        }, 1500);
      }
    } catch (error) {
      handleServerError(error, setErrorMessage);
    }
  };

  return {
    formData,
    setFormData,
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleSubmit,
    resendVerificationEmail,
  };
};
