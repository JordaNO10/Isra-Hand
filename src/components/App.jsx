import React from "react";
import MyRouter from "./Page layout/Router/MyRouter";
import Cookies from "js-cookie";
import { BrowserRouter } from "react-router-dom";
import { AccessibilityProvider } from "./Page layout/Helpers/AccessibilityContext";
import AccessibilityButton from "./Page layout/Accessibility/AccessibilityButton";
import { useSessionHeartbeat } from "./Register & Login/Helpers/useSessionHeartbeat";

import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SessionHeartbeatGate = () => {
  const isLoggedIn = Boolean(Cookies.get("userId")); // או גם userRole אם תרצה
  useSessionHeartbeat({ interval: 15000, enabled: isLoggedIn });
  return null;
};

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
       <SessionHeartbeatGate /> 
        <MyRouter />
        <AccessibilityButton />
        <ToastContainer position="top-center" autoClose={5000} 
        rtl theme="light"/>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
