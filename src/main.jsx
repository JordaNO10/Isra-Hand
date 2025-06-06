import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"; // ✅ or wherever your App is
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true; // Needed if you're using cookies/sessions

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
