import React from "react";
import SigninForm from "./SigninForm";
import "./css/signin.css";

const DropdownSignin = ({ setShowForm }) => {
  return (
    <div className="signin-container signin-dropdown">
      <div className="signin-header">
        <span className="signin-title">Sign In</span>
        <button className="close-button" onClick={() => setShowForm(false)}>
          ✖
        </button>
      </div>
      <SigninForm onSuccess={() => setShowForm(false)} />
    </div>
  );
};

export default DropdownSignin;
