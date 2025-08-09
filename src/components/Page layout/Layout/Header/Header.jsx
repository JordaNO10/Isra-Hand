/**
 * כותרת עליונה (Header):
 * לוגו, קישורי ניווט, כפתורי התחברות/התנתקות ושורת מובייל.
 */
import { useHeaderLogic } from "../../Helpers/useHeaderLogic";
import DropdownSignin from "../../../Register & Login/Signin/DropdownSignin";
import "../../css/Header.css";
import Logo from "./Logo";
import DesktopNavLinks from "./DesktopNavLinks";
import AuthButtons from "./AuthButtons";
import MobileMenu from "./MobileMenu";
import useMobileMenu from "./useMobileMenu";

const Header = ({ onLogout }) => {
  const logic = useHeaderLogic(onLogout);
  const mobile = useMobileMenu();

  return (
    <>
      <nav className="header-nav">
        <div className="header-top-row">
          <div className="mobile-hamburger" onClick={mobile.toggle} aria-label="תפריט">
  <mobile.Icon size={24} />
</div>

          <Logo />

          <div className="header-links desktop-only">
            <DesktopNavLinks />
          </div>
        </div>

        <div className="header-auth desktop-only">
          <AuthButtons {...logic} />
        </div>

        {mobile.open && (
          <MobileMenu
            {...logic}
            onClose={mobile.close}
          />
        )}
      </nav>

      {logic.showSigninDropdown && (
        <DropdownSignin
          setShowForm={logic.setShowSigninDropdown}
          handleLoginSuccess={logic.handleLoginSuccess}
        />
      )}

      {logic.loginMessage && (
        <div className="toast login-toast">{logic.loginMessage}</div>
      )}
      {logic.logoutMessage && (
        <div className="toast logout-toast">{logic.logoutMessage}</div>
      )}
    </>
  );
};

export default Header;
