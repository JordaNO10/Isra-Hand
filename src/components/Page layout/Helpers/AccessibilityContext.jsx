import React, { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [isAccessible, setIsAccessible] = useState(false);
  const [fontScale, setFontScale] = useState(1); // 1 = normal
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("accessibility-settings"));
    if (stored) {
      setIsAccessible(stored.isAccessible || false);
      setFontScale(stored.fontScale || 1);
      setHighContrast(stored.highContrast || false);
      setDyslexicFont(stored.dyslexicFont || false);
    }
  }, []);

  // Save preferences on change
  useEffect(() => {
    localStorage.setItem(
      "accessibility-settings",
      JSON.stringify({ isAccessible, fontScale, highContrast, dyslexicFont })
    );
  }, [isAccessible, fontScale, highContrast, dyslexicFont]);

  // Apply accessibility classes
  useEffect(() => {
    const body = document.body;
    body.classList.toggle("accessible-mode", isAccessible);
    document.documentElement.style.setProperty("--font-scale", fontScale);
    body.classList.toggle("high-contrast", highContrast);
    body.classList.toggle("dyslexic-font", dyslexicFont);
  }, [isAccessible, fontScale, highContrast, dyslexicFont]);

  // Handlers
  const toggleAccessibility = () => setIsAccessible((prev) => !prev);
  const increaseFont = () => setFontScale((prev) => Math.min(prev + 0.1, 2));
  const decreaseFont = () => setFontScale((prev) => Math.max(prev - 0.1, 0.8));
  const resetFont = () => setFontScale(1);
  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const toggleDyslexicFont = () => setDyslexicFont((prev) => !prev);

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

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
