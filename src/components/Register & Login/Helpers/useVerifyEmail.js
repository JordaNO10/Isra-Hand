// src/Helpers/useVerifyEmail.js
/**
 * אימות אימייל:
 * קורא לשרת עם טוקן, שומר קוקיות (כניסה אוטומטית) ומנווט הביתה.
 */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams, useNavigate } from "react-router-dom";

// חילוץ הטוקן מה-URL
const getToken = (params) => params.get("token");

// שמירת קוקיות מהתגובה
const saveCookies = (data) => {
  const { userId, roleId, user_name, full_name, fullName } = data || {};
  Cookies.set("userId", userId);
  Cookies.set("userRole", roleId);
  Cookies.set("userName", user_name || "");
  Cookies.set("fullName", fullName || full_name || "");
};

export const useVerifyEmail = () => {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("מאמת את האימייל...");
  const alreadyRan = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (alreadyRan.current) return;
    alreadyRan.current = true;

    (async () => {
      const token = getToken(params);
      if (!token) { setMessage("קישור אימות חסר."); return; }

      try {
        const { data } = await axios.get(`/users/verify?token=${token}`);
        saveCookies(data);
        setMessage("✅ האימייל אומת בהצלחה! נכנס לחשבון...");

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 2500);
      } catch {
        setMessage("❌ האימות נכשל או שהקישור אינו תקף.");
      }
    })();
  }, [params, navigate]);

  return { message };
};
