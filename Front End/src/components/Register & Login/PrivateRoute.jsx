import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ element, roles }) => {
  const userId = Cookies.get("userId");
  const userRole = Cookies.get("userRole");

  // Check if user is logged in and has one of the required roles
  const isAuthorized = userId && roles.includes(userRole);

  return isAuthorized ? element : <Navigate to="/" />; // Redirect to home if unauthorized
};

export default PrivateRoute;
