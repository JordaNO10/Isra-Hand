import React, { useState } from "react";
import "./css/contactus.css";
import gmailIcon from "./assets/gmail-icon.png";

const Contact = () => {
  const [message, setMessage] = useState("");

  const openEmail = (event) => {
    event.preventDefault(); // Prevent the default form submission
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=jordanhalely@gmail.com&body=${encodeURIComponent(
      message
    )}`;
    window.open(mailtoLink, "_blank");
    setMessage(""); // Clear the message after sending
  };

  return (
    <div className="contactus-main">
      <h2 className="h2-contact">תודה שבחרתם ליצור קשר </h2>
      <form className="contact-form" onSubmit={openEmail}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="הקלד כאן את הודעתך :)"
          rows="5"
          required
          className="contact-textarea"
        />
        <div className="contactus-middle">
          <button type="submit" className="email-button">
            <img src={gmailIcon} alt="Gmail Icon" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
