import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/IsraHand.jpg";
const Header = () => {
  return (
    <>
      <h1>IsraHand</h1>
      <nav>
        <div>
          <img src={logo} alt="Logo" height="35" width="auto" />
        </div>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              Homepage
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
              to="/donation/"
              className={({ isActive }) =>
                isActive ? "menu-item active" : "menu-item"
              }
            >
              Donation
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
      </nav>
    </>
  );
};
export default Header;
