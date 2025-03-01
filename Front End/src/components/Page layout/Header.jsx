import React, { useState } from "react";
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
  const navigate = useNavigate();
  const [logoutMessage, setLogoutMessage] = useState("");

  const handleLogin = () => {
    setShowSigninDropdown((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post("/logout");
      if (response.status === 200) {
        Cookies.remove("userId");
        setLogoutMessage("You have been logged out successfully!");
        setTimeout(() => {
          onLogout();
          navigate("/");
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
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
        <img src={logo} alt="Logo" height="35" width="auto" />
        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            דף הבית
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            אודות
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            יצירת קשר
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;
