import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/IsraHand.jpg";

const Header = () => {
  return (
    <>
      <h1>IsraHand</h1>
      <nav>
        <div className="navigation-container">
          <span className="navigation-label"> Navigation</span>

          <ul className="navigation-menu">
            <img src={logo} alt="Logo" height="35" width="auto" />
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/donations/"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Donations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
