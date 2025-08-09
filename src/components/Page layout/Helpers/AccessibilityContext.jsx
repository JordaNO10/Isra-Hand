/**
 * הקשר נגישות (Context):
 * מנהל מצב נגישות גלובלי (הדגשה/ניגודיות/סקייל/גופן), כולל טעינה ושמירה ב-localStorage
 * והחלת מחלקות/סגנונות על ה-<body> וה-:root.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

/** קריאת הגדרות שנשמרו מקומית */
const getStoredSettings = () => {
  try {
    return JSON.parse(localStorage.getItem("accessibility-settings")) || null;
  } catch {
    return null;
  }
};

/** שמירת ההגדרות המקומיות */
const saveSettings = (settings) => {
  localStorage.setItem("accessibility-settings", JSON.stringify(settings));
};

/** החלת מחלקות/סגנונות על הדום */
const applyAccessibilityClasses = ({ isAccessible, fontScale, highContrast, dyslexicFont }) => {
  const body = document.body;
  body.classList.toggle("accessible-mode", !!isAccessible);
  body.classList.toggle("high-contrast", !!highContrast);
  body.classList.toggle("dyslexic-font", !!dyslexicFont);
  document.documentElement.style.setProperty("--font-scale", String(fontScale || 1));
};

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  const [isAccessible, setIsAccessible] = useState(false);
  const [fontScale, setFontScale] = useState(1);         // 1 = רגיל
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);

  // טעינה ראשונית מהאחסון המקומי
  useEffect(() => {
    const stored = getStoredSettings();
    if (!stored) return;
    setIsAccessible(!!stored.isAccessible);
    setFontScale(stored.fontScale ?? 1);
    setHighContrast(!!stored.highContrast);
    setDyslexicFont(!!stored.dyslexicFont);
  }, []);

  // שמירה בכל שינוי
  useEffect(() => {
    saveSettings({ isAccessible, fontScale, highContrast, dyslexicFont });
  }, [isAccessible, fontScale, highContrast, dyslexicFont]);

  // החלת הסגנונות על הדום
  useEffect(() => {
    applyAccessibilityClasses({ isAccessible, fontScale, highContrast, dyslexicFont });
  }, [isAccessible, fontScale, highContrast, dyslexicFont]);

  // פעולות (קצרות)
  const toggleAccessibility = () => setIsAccessible((v) => !v);
  const increaseFont = () => setFontScale((v) => Math.min(v + 0.1, 2));
  const decreaseFont = () => setFontScale((v) => Math.max(v - 0.1, 0.8));
  const resetFont = () => setFontScale(1);
  const toggleHighContrast = () => setHighContrast((v) => !v);
  const toggleDyslexicFont = () => setDyslexicFont((v) => !v);

  return (
    <AccessibilityContext.Provider
      value={{
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
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

/** הוק צריכה נוח */
export function useAccessibility() {
  return useContext(AccessibilityContext);
}
