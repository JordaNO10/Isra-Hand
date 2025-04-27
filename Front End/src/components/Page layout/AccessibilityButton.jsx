import React, { useState } from "react";
import { useAccessibility } from "./Helpers/useAccessibility";
import "./css/Accessibility.css";

const AccessibilityButton = () => {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize } =
    useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOptions = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className={`accessibility-container ${isOpen ? "open" : ""}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {/* Main Button */}
      <button className="accessibility-btn" onClick={toggleOptions}>
        ♿
      </button>

      {/* Extra Options (only when open) */}
      {isOpen && (
        <div className="accessibility-options">
          <button className="accessibility-option" onClick={increaseFontSize}>
            A+
          </button>
          <button className="accessibility-option" onClick={decreaseFontSize}>
            A-
          </button>
          <button className="accessibility-option" onClick={resetFontSize}>
            🔄
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityButton;
