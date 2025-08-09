/**
 * פוטר האתר:
 * מציג זכויות יוצרים וקישורים לדפי "אודות" ו"צור קשר".
 */
import "../../css/Footer.css";
import FooterLinks from "./FooterLinks";

const Footer = () => (
  <div className="Footer">
    <p>© 2024 All Rights Reserved</p>
    <p>Yarden Halely</p>
    <FooterLinks />
  </div>
);
export default Footer;
