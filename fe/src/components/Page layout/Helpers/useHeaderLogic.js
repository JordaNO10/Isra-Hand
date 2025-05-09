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
  const navigate = useNavigate();
  const [loginMessage, setLoginMessage] = useState("");

  const roleId = Cookies.get("userRole");

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
        Cookies.remove("userRole"); // ✅ Also remove role
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
    showSigninDropdown,
    logoutMessage,
    loginMessage,
    handleLogin,
    handleLogout,
    handleLoginSuccess,
    setShowSigninDropdown,
  };
};
