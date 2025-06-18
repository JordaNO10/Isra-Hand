// src/Helpers/useVerifyEmail.js
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useSearchParams, useNavigate } from "react-router-dom";

export const useVerifyEmail = () => {
  const [params] = useSearchParams();
  const [message, setMessage] = useState("מאמת את האימייל...");
  const alreadyRan = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (alreadyRan.current) return;
    alreadyRan.current = true;

    const verify = async () => {
      const token = params.get("token");
      if (!token) {
        setMessage("קישור אימות חסר.");
        return;
      }

      try {
        const res = await axios.get(`/users/verify?token=${token}`);
        const { userId, roleId, user_name, full_name } = res.data;

        // ✅ Save cookies (auto-login style)
        Cookies.set("userId", userId);
        Cookies.set("userRole", roleId);
        Cookies.set("userName", user_name);
        Cookies.set("fullName", full_name);

        setMessage("✅ האימייל אומת בהצלחה! נכנס לחשבון...");

        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 2500);
      } catch (err) {
        setMessage("❌ האימות נכשל או שהקישור אינו תקף.");
      }
    };

    verify();
  }, [params, navigate]);

  return { message };
};
