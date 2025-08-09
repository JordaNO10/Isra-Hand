/**
 * נתיב פרטי (PrivateRoute)
 * בודק התחברות + תפקידים מורשים. תומך ב-roles מסוג מחרוזת או מערך.
 */
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ element, roles }) => {
  const userId = Cookies.get("userId");
  const userRole = Cookies.get("userRole");
  const rolesArr = Array.isArray(roles) ? roles : roles ? [roles] : [];

  const isAuthorized = !!userId && (rolesArr.length ? rolesArr.includes(userRole) : true);

  return isAuthorized ? element : <Navigate to="/" />;
};

export default PrivateRoute;
