import React from "react";
import { NavLink } from "react-router-dom";
import { useHeaderLogic } from "./Helpers/useHeaderLogic";
import DropdownSignin from "../Register & Login/DropdownSignin";
import "./css/Header.css"; // ✅ Don't need Cookies import anymore

const Header = ({ onLogout }) => {
  const {
    isAuthenticated,
    roleId,
    showSigninDropdown,
    loginMessage,
    logoutMessage,
    handleLogin,
    handleLoginSuccess,
    handleLogout,
    setShowSigninDropdown,
    isAdmin,
    user, 
  } = useHeaderLogic(onLogout);

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
      <div className="header-logo">IsraHand</div>

      <div className="header-links">
        <NavLink to="/" className="header-link">
          בית
        </NavLink>
        <NavLink to="/About" className="header-link">
          אודות
        </NavLink>
        <NavLink to="/Contact" className="header-link">
          צור קשר
        </NavLink>

        {isAuthenticated && roleId ? (
          isAdmin ? (
            <NavLink to={getDashboardPath()} className="header-link">
              דף מנהל
            </NavLink>
          ) : (
            <NavLink to={getDashboardPath()} className="header-link">
              הדף האישי שלי
            </NavLink>
          )
        ) : null}
      </div>

      <div className="header-auth">
        {isAuthenticated && roleId && (
          <span className="hello-message">
            {roleId === "1" && `${user.fullName} שלום👑`}
            {roleId === "2" && `${user.fullName} שלום 🙌`}
            {roleId === "3" && `שלום ${user.fullName} 🎯`}
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

      {showSigninDropdown && (
        <DropdownSignin
          setShowForm={setShowSigninDropdown}
          handleLoginSuccess={handleLoginSuccess}
        />
      )}

      {loginMessage && <div className="toast login-toast">{loginMessage}</div>}
      {logoutMessage && (
        <div className="toast logout-toast">{logoutMessage}</div>
      )}
    </nav>
  );
};

export default Header;
