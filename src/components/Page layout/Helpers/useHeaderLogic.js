import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify"; // ✅ import toast

export const useHeaderLogic = (onLogout) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("userRole")
  );
  const [showSigninDropdown, setShowSigninDropdown] = useState(false);

  const navigate = useNavigate();
  const roleId = Cookies.get("userRole");

  const user = {
    fullName: Cookies.get("fullName"),
  };

  const isAdmin = roleId === "1";

  const handleLogin = () => {
    setShowSigninDropdown((prev) => !prev);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    toast.success("ברוך הבא ל-IsraHand!", {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });
    setShowSigninDropdown(false);
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
        Cookies.remove("fullName");
        Cookies.remove("userRole");
        Cookies.remove("userName");

        toast.info("התנתקת בהצלחה!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });

        setTimeout(() => {
          onLogout?.();
          navigate("/");
          window.location.reload();
        }, 1500); // Match autoClose timing
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("נכשל ביציאה מהמערכת, נסה שוב.");
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
