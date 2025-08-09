/**
 * לוגיקת Header:
 * תפקיד: ניהול התחברות/התנתקות, תפריט התחברות מהיר, והודעות toast.
 * שינוי: סימון התנתקות יזומה (logout_intent) כדי שה-heartbeat לא יציג "מישהו התחבר...".
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

/** ניקוי קוקיות התחברות */
const clearAuthCookies = () => {
  Cookies.remove("userId");
  Cookies.remove("fullName");
  Cookies.remove("userRole");
  Cookies.remove("userName");
};

/** סימון כוונת התנתקות (נצרך ע"י useSessionHeartbeat) */
const markLogoutIntent = () => {
  sessionStorage.setItem("logout_intent", String(Date.now()));
};

export const useHeaderLogic = (onLogout) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("userRole"));
  const [showSigninDropdown, setShowSigninDropdown] = useState(false);

  const navigate = useNavigate();
  const roleId = Cookies.get("userRole");
  const isAdmin = roleId === "1";
  const user = { fullName: Cookies.get("fullName") || "" };

  const handleLogin = () => setShowSigninDropdown((v) => !v);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      // מסמן התנתקות יזומה כדי שה-heartbeat לא יראה "מישהו התחבר..."
      markLogoutIntent();

      // בקשת התנתקות לשרת (השמדה של הסשן)
      await axios.post("/users/logout", {}, { withCredentials: true });

      // ניקוי מקומי וניווט
      clearAuthCookies();
    setIsAuthenticated(false);
    onLogout?.();
    // הצגת הודעה
     toast.success("התנתקת בהצלחה!", {
      position: "top-center",
      autoClose: 2200,
      pauseOnHover: false,
      onClose: () => window.location.reload(), // ← reload after toast closes
    });
      // מעבר נקי למסך התחברות (בלי רענון שמוחק טוסט)
      // navigate("/Signin", { replace: true });
    
      // גם אם השרת נפל – ננקה מקומית כדי לא לתקוע את המשתמש
    } catch (e) {
    clearAuthCookies();
    setIsAuthenticated(false);
    navigate("/Signin", { replace: true });
    toast.error("נכשל ביציאה מהמערכת, נותקת מקומית.", {
      position: "top-center",
      autoClose: 1800,
      pauseOnHover: false,
    });
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
