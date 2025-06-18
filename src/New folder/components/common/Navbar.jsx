import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // We will also create a small CSS for it

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>IsraHand</span>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">דף הבית</Link>
        </li>
        <li>
          <Link to="/about">אודות</Link>
        </li>
        <li>
          <Link to="/contact">צור קשר</Link>
        </li>
      </ul>
      <div className="navbar-auth-buttons">
        <Link to="/signup" className="btn">
          הרשמה
        </Link>
        <Link to="/signin" className="btn">
          התחבר
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
