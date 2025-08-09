import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import axios from "axios";

// Get base URL from Vite env
const apiBase = import.meta.env.VITE_API_BASE
// Make base URL available for fetch/sendBeacon
window.API_BASE = apiBase;

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_BASE;
axios.defaults.withCredentials = true; // Needed if you're using cookies/sessions

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);