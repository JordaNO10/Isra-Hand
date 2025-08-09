/**
 * האזנה גלובלית לסגירת טאב/עמוד כדי לשחרר נעילה של Singlepage.
 */
import { useEffect } from "react";

const useUnlockOnUnload = () => {
  useEffect(() => {
    const broadcastClose = () => {
      try { window.dispatchEvent(new Event("singlepage:close")); } catch {}
    };
    window.addEventListener("beforeunload", broadcastClose);
    window.addEventListener("pagehide", broadcastClose);
    return () => {
      window.removeEventListener("beforeunload", broadcastClose);
      window.removeEventListener("pagehide", broadcastClose);
    };
  }, []);
};
export default useUnlockOnUnload;
