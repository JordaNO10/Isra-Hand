/**
 * Hook עזר לשליפת נתוני משתמש ותרומות לדשבורד.
 * כולל: שליפת נתונים מהשרת, ניהול סטייט, ופורמט לתאריך התחברות אחרונה.
 */
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useDashboardDataHelpers = () => {
  const [userData, setUserData] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  // שליפת נתוני משתמש + תרומות
  const fetchAllData = async () => {
    const userId = Cookies.get("userId");
    if (!userId) {
      setError("User ID not found in cookies.");
      setLoading(false);
      return;
    }

    try {
      const [userResponse, donationsResponse] = await Promise.all([
        axios.get(`/users/${userId}`, { withCredentials: true }),
        axios.get("/donations"),
      ]);

      setUserData(userResponse.data);
      setDonations(donationsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  // פורמט תאריך התחברות אחרונה (לשמור על זמן מקומי)
  const formatLastLogin = (datetimeString) => {
    if (!datetimeString) return "לא התחבר עדיין";

    const [datePart, timePart] = datetimeString.split(" ");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);

    const localDate = new Date(year, month - 1, day, hour, minute, second);

    return localDate.toLocaleString("he-IL", {
      timeZone: "Asia/Jerusalem",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return {
    userData,
    formatLastLogin,
    setUserData,
    donations,
    loading,
    error,
  };
};
