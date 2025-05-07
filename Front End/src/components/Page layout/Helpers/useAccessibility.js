import { useState } from "react";

export const useAccessibility = () => {
  const [fontSize, setFontSize] = useState(16);

  const increaseFontSize = () => setFontSize((size) => size + 2);
  const decreaseFontSize = () => setFontSize((size) => Math.max(12, size - 2));
  const resetFontSize = () => setFontSize(16);

  return {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  };
};
