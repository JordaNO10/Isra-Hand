/**
 * קישורי ניווט בפוטר.
 */
import { NavLink } from "react-router-dom";

const FooterLinks = () => (
  <div className="footer-links">
    <NavLink to="/About">אודות</NavLink>
    <NavLink to="/Contact">צור קשר</NavLink>
  </div>
);
export default FooterLinks;
