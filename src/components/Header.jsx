import React from "react";
import logo from "../assets/IsraHand.jpg";
import { NavLink } from "react-router-dom";
const Header = () => {
  return (
    <>
      <h1>
        <img src={logo} alt="Logo" height="35" width="auto" />
        IsraHand <img src={logo} alt="Logo" height="35" width="auto" />
      </h1>
      <nav>
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
