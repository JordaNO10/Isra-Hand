import React, { useState, useEffect } from "react";
import SigninForm from "./SigninForm";
import "./css/dropdownSignin.css";

const DropdownSignin = ({ setShowForm, handleLoginSuccess }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [bounceIn, setBounceIn] = useState(true);

  const handleClose = () => {
    setFadeOut(true);
    setBounceIn(false);
    setTimeout(() => {
      setShowForm(false);
    }, 300); // Match fade-out animation
  };

  useEffect(() => {
    setBounceIn(true); // Trigger bounce when mounted
  }, []);

  return (
    <div
      className={`signin-dropdown ${fadeOut ? "fade-out" : ""} ${
        bounceIn ? "bounce-in" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <button className="close-button" onClick={handleClose}>
          ✖
        </button>
      </div>
      <SigninForm
        setShowForm={handleClose}
        handleLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default DropdownSignin;
