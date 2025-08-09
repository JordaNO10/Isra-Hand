/**
 * הוק לשחרור נעילת תרומה כאשר המודל נסגר ע"י אירוע חיצוני
 * מאזין לאירוע `singlepage:close` מהחלון ומשחרר את הנעילה אם צריך.
 */
import { useEffect } from "react";

export const useModalCloseRelease = (releaseLock) => {
  useEffect(() => {
    const onClose = () => releaseLock?.();
    window.addEventListener("singlepage:close", onClose);
    return () => window.removeEventListener("singlepage:close", onClose);
  }, [releaseLock]);
};
