// AccessibilityButton.jsx
import React, { useState } from "react";
import { useAccessibility } from "./Helpers/AccessibilityContext";
import "./css/Accessibility.css";

const AccessibilityButton = () => {
  const [showPanel, setShowPanel] = useState(false);

  const {
    isAccessible,
    fontScale,
    highContrast,
    dyslexicFont,
    toggleAccessibility,
    increaseFont,
    decreaseFont,
    resetFont,
    toggleHighContrast,
    toggleDyslexicFont,
  } = useAccessibility();

  return (
    <>
      <button
        className="accessibility-btn"
        onClick={() => setShowPanel((prev) => !prev)}
        aria-pressed={showPanel}
        aria-label="Toggle accessibility settings panel"
        title="Toggle accessibility settings"
      >
        {showPanel ? "❌ סגור נגישות" : "🦮 נגישות"}
      </button>

      {showPanel && (
        <div className="accessibility-panel">
          <h3>🦮 הגדרות נגישות</h3>

          <div className="panel-row">
            <label>
              <input
                type="checkbox"
                checked={isAccessible}
                onChange={toggleAccessibility}
              />
              הפעל מצב נגישות
            </label>
          </div>

          <div className="panel-row">
            <label>גודל טקסט:</label>
            <div className="font-buttons">
              <button onClick={decreaseFont}>A−</button>
              <button onClick={resetFont}>A</button>
              <button onClick={increaseFont}>A+</button>
            </div>
            <span className="font-scale-display">{fontScale.toFixed(1)}x</span>
          </div>

          <div className="panel-row">
            <label>
              <input
                type="checkbox"
                checked={highContrast}
                onChange={toggleHighContrast}
              />
              ניגודיות גבוהה
            </label>
          </div>

          <div className="panel-row">
            <label>
              <input
                type="checkbox"
                checked={dyslexicFont}
                onChange={toggleDyslexicFont}
              />
              גופן ידידותי לדיסלקציה
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityButton;
