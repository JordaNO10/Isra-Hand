// src/Helpers/useResetPassword.js
/**
 * איפוס סיסמה לפי טוקן:
 * 1) ולידציה מקומית
 * 2) איפוס סיסמה בשרת
 * 3) התחברות אוטומטית
 * 4) שמירת קוקיות וניווט הביתה
 */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// בדיקת התאמת סיסמאות
const validatePasswords = (password, confirmPassword, setError) => {
  if (password !== confirmPassword) {
    setError("הסיסמאות אינן תואמות");
    return false;
  }
  return true;
};

// קריאת איפוס סיסמה
const resetPasswordRequest = async (token, password) => {
  const res = await axios.post(`/users/reset-password/${token}`, { password });
  return res.data?.email; // מייל להזדהות בהתחברות
};

// התחברות אוטומטית לאחר איפוס
const autoLogin = async (email, password) => {
  const res = await axios.post(
    "/users/login",
    { emailOrUsername: email, password },
    { withCredentials: true }
  );
  return res.data;
};

// שמירת קוקיות וניווט
const persistAndRedirect = (navigate, data) => {
  const { userId, roleId, user_name, full_name, fullName } = data;
  Cookies.set("userId", userId);
  Cookies.set("userRole", roleId);
  Cookies.set("userName", user_name || "");
  Cookies.set("fullName", fullName || full_name || "");

  toast.success("התחברת בהצלחה!");
  setTimeout(() => {
    navigate("/");
    window.location.reload();
  }, 1500);
};

export const useResetPassword = (token) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /** שליחה */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validatePasswords(password, confirmPassword, setErrorMessage)) return;

    try {
      setLoading(true);
      const email = await resetPasswordRequest(token, password);
      const loginData = await autoLogin(email, password);
      persistAndRedirect(navigate, loginData);
    } catch (err) {
      console.error("שגיאה באיפוס סיסמה:", err);
      setErrorMessage(err?.response?.data?.message || "שגיאה באיפוס הסיסמה");
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    loading,
    errorMessage,
  };
};
