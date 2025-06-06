import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useDonorRating = () => {
  const [rating, setRating] = useState(null);
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
        setRating(response.data); // { user_id, avg_rating, total_ratings }
      } catch (err) {
        console.error("Error fetching donor rating:", err);
        setError("Failed to fetch donor rating.");
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, []);

  return { rating, loading, error };
};
