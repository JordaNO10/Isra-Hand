/**
 * כפתורי התחברות/הרשמה/התנתקות + קישור לפרופיל בהתאם לתפקיד.
 */
import { NavLink } from "react-router-dom";

const profilePathByRole = (roleId) =>
  roleId === "1" ? "/Admin" : roleId === "2" ? "/dashboard" : "/dashboard";

const AuthButtons = ({
  isAuthenticated,
  roleId,
  handleLogin,
  handleLogout,
}) => {
  return !isAuthenticated ? (
    <>
      <button className="auth-button" onClick={handleLogin}>התחבר</button>
      <NavLink to="/Signup" className="auth-button secondary">הרשמה</NavLink>
    </>
  ) : (
    <>
      <NavLink to={profilePathByRole(roleId)} className="hello-message">הפרופיל שלי</NavLink>
      <button className="auth-button" onClick={handleLogout}>התנתק</button>
    </>
  );
};
export default AuthButtons;
