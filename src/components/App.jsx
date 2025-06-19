import React from "react";
import MyRouter from "./Page layout/MyRouter";
import AccessibilityButton from "./Page layout/AccessibilityButton";
import { BrowserRouter } from "react-router-dom";

// ✅ Import Toast support
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <MyRouter />
      <AccessibilityButton />

      {/* ✅ Global toast container */}
      <ToastContainer position="top-center" autoClose={1500} />
    </BrowserRouter>
  );
}

export default App;
