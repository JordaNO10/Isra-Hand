/**
 * תפקיד: לבדוק "חי" אם יש סשן בשרת; אם לא — לנקות קוקיות, להציג Toast, ולהפנות ל-/Signin.
 * רץ רק אם enabled=true. מאזינים/אינטרוול נרשמים/מנוקים בהתאם.
 */
import { useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const clearClientAuth = () => {
  Cookies.remove("userId");
  Cookies.remove("userRole");
  Cookies.remove("fullName");
};

export const useSessionHeartbeat = ({ interval = 100, enabled = false } = {}) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const toastedRef = useRef(false); 

  const ping = useCallback(async () => {
    if (!enabled) return;
    try {
      await axios.get("/users/me", { withCredentials: true });
    } catch (e) {
      if (e?.response?.status === 401) {
  if (!toastedRef.current) {
    toastedRef.current = true;
    const autoCloseMs = 6000;

    toast.info("מישהו התחבר לחשבון שלך ממכשיר אחר — נותקת מכאן.", {
      toastId: "session-kicked",
      autoClose: autoCloseMs,
      pauseOnHover: true,
      onClose: () => {
        window.location.reload();
      },
    });
  }
        clearClientAuth();
                navigate("/", { replace: true });

      }
    }
  }, [enabled, navigate]);

  useEffect(() => {
    if (!enabled) return;

    // אינטרוול
    timerRef.current = setInterval(ping, interval);

    const onFocus = () => ping();
    const onVis = () => { if (document.visibilityState === "visible") ping(); };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    ping();

    return () => {
      clearInterval(timerRef.current);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [enabled, interval, ping]);
};
