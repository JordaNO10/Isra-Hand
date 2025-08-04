import React from "react";
import MyRouter from "./Page layout/MyRouter";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AccessibilityProvider } from "./Page layout/Helpers/AccessibilityContext";
import AccessibilityButton from "./Page layout/AccessibilityButton";

function App() {
  return (
    <AccessibilityProvider>
      <BrowserRouter>
        <MyRouter />
        <AccessibilityButton />
        <ToastContainer position="top-center" autoClose={1500} />
      </BrowserRouter>
    </AccessibilityProvider>
  );
}

export default App;
