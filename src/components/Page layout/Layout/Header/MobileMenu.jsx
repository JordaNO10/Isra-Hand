/**
 * תפריט מובייל: ניווט + פעולות התחברות/התנתקות.
 */
import { NavLink } from "react-router-dom";

const MobileMenu = ({
  isAuthenticated,
  roleId,
  handleLogin,
  handleLogout,
  onClose,
}) => (
  <div className="mobile-menu" role="dialog" aria-modal="true">
    <NavLink to="/" className="header-link" onClick={onClose}>דף הבית</NavLink>
    <NavLink to="/donations" className="header-link" onClick={onClose}>תרומות</NavLink>

    {!isAuthenticated ? (
      <>
        <button className="auth-button" onClick={handleLogin}>התחבר</button>
        <NavLink to="/Signup" className="auth-button secondary" onClick={onClose}>
          הרשמה
        </NavLink>
      </>
    ) : (
      <>
        <NavLink to={roleId === "1" ? "/Admin" : roleId === "2" ? "/donorpage" : "/requestorDashboard"}
                 className="hello-message" onClick={onClose}>
          הפרופיל שלי
        </NavLink>
        <button className="auth-button" onClick={handleLogout}>התנתק</button>
      </>
    )}
  </div>
);
export default MobileMenu;
