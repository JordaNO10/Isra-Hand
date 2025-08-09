// src/Helpers/useDropdownSigninHelpers.js
/**
 * עזרי התחברות (דרופדאון/מסכים)
 * תפקיד: ניהול שדות טופס, שליחת התחברות, טיפול בשגיאות, "שלח שוב אימייל אימות".
 * שינוי לפרויקט: נרמול role_id (3→2) לפני שמירת הקוקיות + שמות שדות עקביים.
 */
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate,useLocation  } from "react-router-dom";
import { toast } from "react-toastify";

// --- נרמול תפקידים בצד לקוח ---
const normalizeRoleId = (r) => (String(r) === "3" ? 2 : Number(r) || null);

// ולידציה בסיסית
const validateForm = (fd, setErr) => {
  if (!fd.emailOrUsername || !fd.password) { setErr("אנא מלא/י את כל השדות"); return false; }
  return true;
};

// שמירת קוקיות
const saveCookies = (data) => {
  const role = normalizeRoleId(data.roleId);
  if (data.userId) Cookies.set("userId", String(data.userId), { sameSite: "lax" });
  if (role != null) Cookies.set("userRole", String(role),     { sameSite: "lax" });
  Cookies.set("fullName", data.fullName || data.full_name || "", { sameSite: "lax" });
};

// ניווט לפי תפקיד
const go = (navigate, roleId) => {
  if (String(roleId) === "1") navigate("/admin");
};

// הודעת שגיאה מהשרת
const serverMsg = (error) =>
  error?.response?.data?.error || error?.response?.data?.message || "שגיאה בהתחברות";

export const useDropdownSigninHelpers = (setShowForm, handleLoginSuccess) => {
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  /**בדיקה אם אנחנו בדף הרשמה */
  const isOnSignupPage =
    location.pathname.replace(/\/+$/, "").toLowerCase() === "/signup";
  /** שינוי שדה קלט */
  const handleInputChange = (e) => setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  /** שליחת אימייל אימות מחדש */
  const resendVerificationEmail = async () => {
    const { data } = await axios.post(
      "/users/resend-verification",
      { emailOrUsername: formData.emailOrUsername },
      { withCredentials: true }
    );
    return data;
  };

  /** שליחת התחברות */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData, setErrorMessage)) return;

    try {
      const { data } = await axios.post(
        "/users/login",
        { emailOrUsername: formData.emailOrUsername, password: formData.password },
        { withCredentials: true }
      );
      saveCookies(data);
      setErrorMessage("");
      if (setShowForm) setShowForm(false);

      toast.success("מתחבר לחשבון...", { position: "top-center", autoClose: 1200, pauseOnHover: false });
      setTimeout(() => {
        go(navigate, normalizeRoleId(data.roleId));
        if (handleLoginSuccess) handleLoginSuccess();
        if (isOnSignupPage) {
          window.location.reload();
        }
      }, 1200);
    } catch (error) {
      const msg = serverMsg(error);
      // התאמה ל-UI שלך: אם זו הודעת אימות—הטופס יציג כפתור "שלח שוב"
      setErrorMessage(/אמת/.test(msg) ? "אנא אמת את כתובת האימייל שלך" : msg);
    }
  };

  return {
    formData, setFormData, errorMessage, setErrorMessage,
    handleInputChange, handleSubmit, resendVerificationEmail,
  };
};
