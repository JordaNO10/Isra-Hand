/**
 * כפתור נגישות:
 * פותח/סוגר את פאנל ההגדרות ושולח פעולות ל-AccessibilityContext.
 */
import { useState } from "react";
import { useAccessibility } from "../Helpers/AccessibilityContext";
import "../css/Accessibility.css";
import AccessibilityPanel from "./AccessibilityPanel";

const AccessibilityButton = () => {
  const [showPanel, setShowPanel] = useState(false);
  const ctx = useAccessibility();

  return (
    <>
      <button
        className="accessibility-btn"
        onClick={() => setShowPanel((v) => !v)}
        aria-pressed={showPanel}
        aria-label="פתיחת/סגירת הגדרות נגישות"
        title="הגדרות נגישות"
      >
        {showPanel ? "❌ סגור נגישות" : "🦮 נגישות"}
      </button>

      {showPanel && <AccessibilityPanel {...ctx} />}
    </>
  );
};

export default AccessibilityButton;
