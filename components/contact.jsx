import React from "react";
import "../css/style.css";
import gmailIcon from "../assets/gmail-icon.png";
const Contact = () => {
  const openEmail = () => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=jordanhalely@gmail.com",
      "_blank"
    );
  };

  return (
    <div className="main">
      <h2 className="h2-contact">
        You can contact us following the following Button:
      </h2>
      <div className="middle">
        <button onClick={openEmail} className="email-button">
          <img src={gmailIcon} alt="Gmail Icon"/>
        </button>
      </div>
    </div>
  );
};

export default Contact;
