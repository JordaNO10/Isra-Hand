/**
 * איפוס סיסמה לפי טוקן → התחברות אוטומטית → שמירת קוקיות → ניווט.
 * כולל נרמול role_id (3→2) במקרה legacy.
 */
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

// נרמול role_id במקרה legacy
const normalizeRoleId = (r) => (String(r) === "3" ? 2 : Number(r) || null);

// בדיקה שהסיסמאות תואמות
const pwdMatch = (p, c, setErr) =>
  p === c ? true : (setErr("הסיסמאות אינן תואמות"), false);

// בקשת איפוס סיסמה לשרת
const resetPasswordRequest = async (token, password) =>
  (await axios.post(`/users/reset-password/${token}`, { password })).data?.email;

// התחברות אוטומטית אחרי איפוס
const autoLogin = async (email, password) =>
  (
    await axios.post(
      "/users/login",
      { emailOrUsername: email, password },
      { withCredentials: true }
    )
  ).data;

// שמירת קוקיות וניווט אחרי התחברות
const persistAndRedirect = (navigate, data) => {
  const role = normalizeRoleId(data.roleId);
  Cookies.set("userId", String(data.userId));
  if (role != null) Cookies.set("userRole", String(role));
  Cookies.set("userName", data.user_name || "");
  Cookies.set("fullName", data.fullName || data.full_name || "");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!pwdMatch(password, confirmPassword, setErrorMessage)) return;

    try {
      setLoading(true);
      const email = await resetPasswordRequest(token, password);
      const loginData = await autoLogin(email, password);
      persistAndRedirect(navigate, loginData);
    } catch (err) {
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
