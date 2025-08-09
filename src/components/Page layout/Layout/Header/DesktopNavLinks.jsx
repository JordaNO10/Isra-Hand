/**
 * קישורי ניווט לדסקטופ.
 */
import { NavLink } from "react-router-dom";

const DesktopNavLinks = () => (
  <>
    <NavLink to="/" className="header-link">דף הבית</NavLink>
    <NavLink to="/donations" className="header-link">תרומות</NavLink>
  </>
);
export default DesktopNavLinks;
