import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const useResetPassword = (token) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("הסיסמאות אינן תואמות");
      return;
    }

    try {
      setLoading(true);

      // 🟢 שלב 1: איפוס סיסמה
      const res = await axios.post(`/users/reset-password/${token}`, {
        password,
      });

      const userEmail = res.data?.email;

      // 🟢 שלב 2: התחברות אוטומטית עם הסיסמה החדשה
      const loginRes = await axios.post(
        "/users/login",
        {
          emailOrUsername: userEmail,
          password,
        },
        { withCredentials: true } // חובה בשביל לשמור session ב-cookie
      );

      const { userId, roleId, user_name, full_name } = loginRes.data;

      // 🟢 שלב 3: שמירת cookies כמו ב-useVerifyEmail
      Cookies.set("userId", userId);
      Cookies.set("userRole", roleId);
      Cookies.set("userName", user_name);
      Cookies.set("fullName", full_name);

      toast.success("התחברת בהצלחה!");

      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("שגיאה באיפוס סיסמה:", err);
      setErrorMessage(err.response?.data?.message || "שגיאה באיפוס הסיסמה");
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
