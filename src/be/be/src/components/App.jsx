import React from "react";
import MyRouter from "./Page layout/MyRouter";
import AccessibilityButton from "./Page layout/AccessibilityButton";
import { BrowserRouter } from "react-router-dom";

function App() {
  const handleLogout = () => {
    // Logic for handling logout (e.g., redirect to the signup page, update state)
    console.log("User has logged out");
  };

  return (
    <BrowserRouter>
      <MyRouter onLogout={handleLogout} /> <AccessibilityButton />
    </BrowserRouter>
  );
}

export default App;
