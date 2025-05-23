// src/helpers/dashboards/useDashboardDataHelpers.js
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

  return {
    userData,
    donations,
    loading,
    error,
  };
};
