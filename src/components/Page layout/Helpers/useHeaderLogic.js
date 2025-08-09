/**
 * לוגיקת Header:
 * מנהל מצב התחברות/התנתקות, תפריט התחברות מהיר, והודעות toast.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

/** ניקוי קוקיז התחברות */
const clearAuthCookies = () => {
  Cookies.remove("userId");
  Cookies.remove("fullName");
  Cookies.remove("userRole");
  Cookies.remove("userName");
};

/** מעבר לדף הבית עם רענון (לסגירת מצבים) */
const goHomeWithReload = (navigate, cb) => {
  cb?.();
  navigate("/");
  window.location.reload();
};

/** הודעות ברירת מחדל */
const toastOk = (msg) =>
  toast.success(msg, { position: "top-center", autoClose: 1500, pauseOnHover: false });
const toastInfo = (msg) =>
  toast.info(msg, { position: "top-center", autoClose: 1500, pauseOnHover: false });
const toastErr = (msg) =>
  toast.error(msg, { position: "top-center", autoClose: 1800, pauseOnHover: false });

export const useHeaderLogic = (onLogout) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("userRole"));
  const [showSigninDropdown, setShowSigninDropdown] = useState(false);

  const navigate = useNavigate();
  const roleId = Cookies.get("userRole");
  const isAdmin = roleId === "1";
  const user = { fullName: Cookies.get("fullName") };

  const handleLogin = () => setShowSigninDropdown((v) => !v);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowSigninDropdown(false);
    toastOk("ברוך הבא ל-IsraHand!");
  };

  const handleLogout = async () => {
    try {
      const res = await axios.post("/users/logout", {}, { withCredentials: true });
      if (res.status === 200) {
        clearAuthCookies();
        toastInfo("התנתקת בהצלחה!");
        setTimeout(() => goHomeWithReload(navigate, onLogout), 1500);
      }
    } catch (e) {
      console.error("Logout error:", e);
      toastErr("נכשל ביציאה מהמערכת, נסה שוב.");
    }
  };

  return {
    isAuthenticated,
    roleId,
    isAdmin,
    user,
    showSigninDropdown,
    handleLogin,
    handleLoginSuccess,
    handleLogout,
    setShowSigninDropdown,
  };
};
