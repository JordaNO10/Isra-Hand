import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import logo from "./assets/IsraHand.jpg";
import axios from "axios";
import DropdownSignin from "../Sign up/signin";
import "./css/header.css";
import "../Sign up/css/signin.css";

const Header = ({ onLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!Cookies.get("userId")
  );
  const [showSigninDropdown, setShowSigninDropdown] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  const [logoutMessage, setLogoutMessage] = useState(""); // State for logout message

  const handleLogin = () => {
    console.log("Login button clicked"); // Debugging log
    setShowSigninDropdown((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout"); // Adjust the endpoint as needed
      if (response.status === 200) {
        Cookies.remove("userId"); // Remove the cookie on successful logout
        setLogoutMessage("You have been logged out successfully!"); // Set logout message
        setTimeout(() => {
          onLogout(); // Call the logout prop to update the app state
          navigate("/"); // Navigate to the homepage
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleCloseDropdown = (e) => {
    if (!e.target.closest(".dropdown-container")) return;
    setShowSigninDropdown(true);
  };

  useEffect(() => {
    if (showSigninDropdown) {
      window.addEventListener("click", handleCloseDropdown);
    }
    return () => {
      window.removeEventListener("click", handleCloseDropdown);
    };
  }, [showSigninDropdown]);

  return (
    <div>
      <nav>
        <div className="navigation-container">
          <div className="auth-buttons">
            {!isAuthenticated ? (
              <>
                <button className="btn-login" onClick={handleLogin}>
                  התחבר
                </button>
                {showSigninDropdown && (
                  <div className="dropdown-overlay">
                    <div className="dropdown-container">
                      <DropdownSignin setShowForm={setShowSigninDropdown} />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => navigate("/signup")}
                  className="btn-register"
                >
                  הרשמה
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-dashboard"
                >
                  לוח בקרה
                </button>
                <button className="logout" onClick={handleLogout}>
                  התנתק
                </button>
                {logoutMessage && (
                  <div className="logout-message">{logoutMessage}</div>
                )}
              </>
            )}
          </div>
          <h1 className="header">IsraHand</h1>
          <div className="nav-inner">
            <button className="btn">
              <span className="icon">☰</span>
              <span className="text">תפריט</span>
            </button>
            <ul className="navigation-menu">
              <img src={logo} alt="Logo" height="35" width="auto" />
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  דף הבית
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  אודות
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "menu-item active" : "menu-item"
                  }
                >
                  יצירת קשר
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
