import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export const useHeaderLogic = (onLogout) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("userRole")
  );
  const [showSigninDropdown, setShowSigninDropdown] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const roleId = Cookies.get("userRole");
  const user = {
    fullName: Cookies.get("fullName"),
  };

  const isAdmin = roleId === "1"; // ✅ FIXED

  const handleLogin = () => {
    setShowSigninDropdown((prev) => !prev);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setLoginMessage("ברוך הבא ל-IsraHand!");
    setShowSigninDropdown(false);
    setTimeout(() => {
      setLoginMessage("");
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "/users/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        Cookies.remove("userId");
        Cookies.remove('fullName')
        Cookies.remove("userRole");
        Cookies.remove("userName"); // ✅ Optional, clear name too
        setLogoutMessage("התנתקת בהצלחה!");
        setTimeout(() => {
          onLogout();
          navigate("/");
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("נכשל ביציאה מהמערכת, נסה שוב.");
    }
  };

  return {
    isAuthenticated,
    roleId,
    isAdmin,
    user,
    showSigninDropdown,
    loginMessage,
    logoutMessage,
    handleLogin,
    handleLoginSuccess,
    handleLogout,
    setShowSigninDropdown,
  };
};
