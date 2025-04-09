// PageSignin.jsx
import React from "react";
import SigninForm from "./SigninForm";
import "./css/signin.css";

const PageSignin = () => {
  return (
    <div className="signup-form">
      {" "}
      {/* Matches signup form container */}
      <p className="title">התחברות</p>
      <p className="message">הזן את פרטיך כדי להיכנס למערכת</p>
      <SigninForm />
    </div>
  );
};

export default PageSignin;
