/**
 * פאנל הגדרות נגישות:
 * מציג בקרים: הפעלה, גודל טקסט, ניגודיות, גופן דיסלקסי.
 */
import ToggleRow from "./ToggleRow";
import FontControls from "./FontControls";

const AccessibilityPanel = ({
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
}) => {
  return (
    <div className="accessibility-panel">
      <h3>🦮 הגדרות נגישות</h3>

      <ToggleRow
        label="הפעל מצב נגישות"
        checked={isAccessible}
        onChange={toggleAccessibility}
      />

      <FontControls
        fontScale={fontScale}
        onIncrease={increaseFont}
        onDecrease={decreaseFont}
        onReset={resetFont}
      />

      <ToggleRow
        label="ניגודיות גבוהה"
        checked={highContrast}
        onChange={toggleHighContrast}
      />

      <ToggleRow
        label="גופן ידידותי לדיסלקציה"
        checked={dyslexicFont}
        onChange={toggleDyslexicFont}
      />
    </div>
  );
};

export default AccessibilityPanel;
