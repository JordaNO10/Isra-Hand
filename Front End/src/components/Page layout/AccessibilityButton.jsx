import React, { useState } from "react";
import { FaWheelchair, FaFont, FaAdjust } from "react-icons/fa"; // Icons for accessibility features
import "./css/accessibilityButton.css";

const AccessibilityButton = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Default font size in pixels

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle("high-contrast");
  };

  // Increase font size
  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
    document.body.style.fontSize = `${fontSize + 2}px`;
  };

  // Decrease font size
  const decreaseFontSize = () => {
    setFontSize((prevSize) => prevSize - 2);
    document.body.style.fontSize = `${fontSize - 2}px`;
  };

  return (
    <div className="accessibility-container">
      <button
        className="accessibility-btn"
        aria-label="Accessibility Settings"
        onClick={toggleHighContrast}
      >
        <FaWheelchair />
      </button>

      <div className="accessibility-options">
        <button
          className="accessibility-option"
          aria-label="Increase Font Size"
          onClick={increaseFontSize}
        >
          <FaFont /> +
        </button>
        <button
          className="accessibility-option"
          aria-label="Decrease Font Size"
          onClick={decreaseFontSize}
        >
          <FaFont /> -
        </button>
        <button
          className="accessibility-option"
          aria-label="Toggle High Contrast Mode"
          onClick={toggleHighContrast}
        >
          <FaAdjust />
        </button>
      </div>
    </div>
  );
};

export default AccessibilityButton;
