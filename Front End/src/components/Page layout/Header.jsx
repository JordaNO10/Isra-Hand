import React from "react";
import { NavLink } from "react-router-dom";
import { useHeaderLogic } from "./Helpers/useHeaderLogic";
import DropdownSignin from "../Register & Login/DropdownSignin";
import "./css/Header.css";

const Header = ({ onLogout }) => {
  const {
    isAuthenticated,
    roleId,
    showSigninDropdown,
    loginMessage,
    logoutMessage,
    handleLogin,
    handleLogout,
    setShowSigninDropdown,
  } = useHeaderLogic(onLogout);

  // Determine dashboard path based on role
  const getDashboardPath = () => {
    switch (roleId) {
      case "1":
        return "/Admin";
      case "2":
        return "/donorpage";
      case "3":
        return "/RequestorDashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="header-nav">
      {/* Logo */}
      <div className="header-logo">IsraHand</div>

      {/* Navigation Links */}
      <div className="header-links">
        <NavLink to="/" className="header-link">
          דף הבית
        </NavLink>
        <NavLink to="/About" className="header-link">
          אודות
        </NavLink>
        <NavLink to="/Contact" className="header-link">
          צור קשר
        </NavLink>

        {/* Dashboard link if logged in */}
        {isAuthenticated && roleId && (
          <NavLink to={getDashboardPath()} className="header-link">
            הדף האישי שלי
          </NavLink>
        )}
      </div>

      {/* Authentication Section */}
      <div className="header-auth">
        {isAuthenticated && roleId && (
          <span className="hello-message">
            {roleId === "1" && "שלום אדמין 👑"}
            {roleId === "2" && "שלום תורם 🙌"}
            {roleId === "3" && "שלום מבקש 🎯"}
          </span>
        )}

        {!isAuthenticated ? (
          <>
            <button className="auth-button" onClick={handleLogin}>
              התחבר
            </button>
            <NavLink to="/Signup" className="auth-button secondary">
              הרשמה
            </NavLink>
          </>
        ) : (
          <button className="auth-button" onClick={handleLogout}>
            התנתק
          </button>
        )}
      </div>

      {/* Signin Dropdown */}
      {showSigninDropdown && (
        <DropdownSignin setShowForm={setShowSigninDropdown} />
      )}

      {/* Toast Messages */}
      {loginMessage && <div className="toast login-toast">{loginMessage}</div>}
      {logoutMessage && (
        <div className="toast logout-toast">{logoutMessage}</div>
      )}
    </nav>
  );
};

export default Header;
