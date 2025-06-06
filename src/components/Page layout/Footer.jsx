import React from "react";
import "./css/Footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="Footer">
      <p>© 2024 All Rights Reserved</p>
      <p>Yarden Halely</p>
      <div className="footer-links">
        <NavLink to="/About">אודות</NavLink>
        <NavLink to="/Contact">צור קשר</NavLink>
      </div>
    </div>
  );
};

export default Footer;
