import React from "react";
import MyRouter from "./Page layout/Router/MyRouter";
import { BrowserRouter } from "react-router-dom";
import { AccessibilityProvider } from "./Page layout/Helpers/AccessibilityContext";
import AccessibilityButton from "./Page layout/Accessibility/AccessibilityButton";

import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <MyRouter />
        <AccessibilityButton />
        <ToastContainer position="top-center" autoClose={5000} 
        rtl theme="light"/>
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
