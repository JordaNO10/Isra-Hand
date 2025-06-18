import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useDonorRating = () => {
  const [rating, setRating] = useState(null); // actual rating data
  const [status, setStatus] = useState(""); // "noDonations", "noRatings", "hasRatings"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
      const userId = Cookies.get("userId");
      if (!userId) {
        setError("User ID not found in cookies.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`/ratings/${userId}`);
        const data = response.data;

        if (!data || Object.keys(data).length === 0) {
          setStatus("noDonations");
        } else if (data.total_ratings === 0 || data.avg_rating === null) {
          setRating(data);
          setStatus("noRatings");
        } else {
          setRating(data);
          setStatus("hasRatings");
        }
      } catch (err) {
        console.error("Error fetching donor rating:", err);
        setError("Failed to fetch donor rating.");
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, []);

  return { rating, status, loading, error };
};
