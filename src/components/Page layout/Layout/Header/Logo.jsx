/**
 * לוגו + קישור לדף הבית.
 */
import { NavLink } from "react-router-dom";
import AllWhiteLogo from "../../../../assets/Logo.Jpeg";

const Logo = () => (
  <div className="header-logo">
    <NavLink to="/" className="logo-text-link">
      <img src={AllWhiteLogo} alt="IsraHand Logo" />
    </NavLink>
  </div>
);
export default Logo;
