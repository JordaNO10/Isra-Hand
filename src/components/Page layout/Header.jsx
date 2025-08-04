import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { useHeaderLogic } from "./Helpers/useHeaderLogic";
import DropdownSignin from "../Register & Login/DropdownSignin";
import "./css/Header.css";
import AllWhiteLogo from "../../assets/Logo.Jpeg";
import { GiHamburgerMenu } from "react-icons/gi";

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
    user,
  } = useHeaderLogic(onLogout);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="header-nav">
        <div className="header-top-row">
          {/* Hamburger icon for mobile */}
          <div
            className="mobile-hamburger"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <GiHamburgerMenu size={24} />
          </div>

          {/* Logo */}
          <div className="header-logo">
            <NavLink to="/" className="logo-text-link">
              <img src={AllWhiteLogo} alt="IsraHand Logo" />
            </NavLink>
          </div>

          {/* Desktop Nav Links */}
          <div className="header-links desktop-only">
            <NavLink to="/" className="header-link">
              דף הבית
            </NavLink>
            <NavLink to="/donations" className="header-link">
              תרומות
            </NavLink>
          </div>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="header-auth desktop-only">
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
            <>
              <NavLink
                to={
                  roleId === "1"
                    ? "/Admin"
                    : roleId === "2"
                    ? "/donorpage"
                    : "/requestorDashboard"
                }
                className="hello-message"
              >
                הפרופיל שלי
              </NavLink>
              <button className="auth-button" onClick={handleLogout}>
                התנתק
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <NavLink
              to="/"
              className="header-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              דף הבית
            </NavLink>
            <NavLink
              to="/donations"
              className="header-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              תרומות
            </NavLink>

            {!isAuthenticated ? (
              <>
                <button className="auth-button" onClick={handleLogin}>
                  התחבר
                </button>
                <NavLink
                  to="/Signup"
                  className="auth-button secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  הרשמה
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={
                    roleId === "1"
                      ? "/Admin"
                      : roleId === "2"
                      ? "/donorpage"
                      : "/requestorDashboard"
                  }
                  className="hello-message"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  הפרופיל שלי
                </NavLink>
                <button className="auth-button" onClick={handleLogout}>
                  התנתק
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Dropdown Signin */}
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
    </>
  );
};

export default Header;
