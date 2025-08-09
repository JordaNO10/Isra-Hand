// src/Helpers/useVerifyEmail.js
/**
 * אימות אימייל: קריאת טוקן מה-URL, בקשה לשרת, שמירת קוקיות (כולל נרמול role) וניווט.
 */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams, useNavigate } from "react-router-dom";

const norm = (r) => (String(r) === "3" ? 2 : Number(r) || null);
const saveCookies = (data) => {
  const role = norm(data?.roleId);
  if (data?.userId) Cookies.set("userId", String(data.userId));
  if (role != null) Cookies.set("userRole", String(role));
  Cookies.set("userName", data?.user_name || "");
  Cookies.set("fullName", data?.fullName || data?.full_name || "");
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
      const token = params.get("token");
      if (!token) { setMessage("קישור אימות חסר."); return; }

      try {
        const { data } = await axios.get(`/users/verify?token=${token}`, { withCredentials: true });
        saveCookies(data);
        setMessage("✅ האימייל אומת בהצלחה! נכנס לחשבון...");
        setTimeout(() => { navigate("/"); window.location.reload(); }, 2500);
      } catch {
        setMessage("❌ האימות נכשל או שהקישור אינו תקף.");
      }
    })();
  }, [params, navigate]);

  return { message };
};
