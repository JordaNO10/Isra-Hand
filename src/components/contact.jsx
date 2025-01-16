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
    <div>
      <h2 className="h2-contact">
        You can contact us following the following Button:
      </h2>
      <nav class="contactus-button">
        <ul>
          <li>
            <button onClick={openEmail} className="email-button">
              <img src={gmailIcon} alt="Gmail Icon" className="email-icon" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Contact;
