/**
 * קובץ כניסה ראשי של האפליקציה.
 * מגדיר Base URL ל־API, מגדיר ברירות מחדל ל־Axios, ומרנדר את ה־App.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import axios from "axios";

// Base URL מתוך Vite env
const apiBase = import.meta.env.VITE_API_BASE;
window.API_BASE = apiBase; // חשיפה גלובלית עבור fetch/sendBeacon

// הגדרות ברירת מחדל ל־Axios
axios.defaults.baseURL = import.meta.env.VITE_API_BASE;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
