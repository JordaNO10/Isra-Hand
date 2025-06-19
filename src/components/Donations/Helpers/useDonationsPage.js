import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ category: "", subCategory: "" });
  const LIMIT = 3;
  const fetchDonations = useCallback(
    async (append = false, currentOffset = 0) => {
      try {
        setLoading(true);
        const res = await axios.get("/donations/available", {
          params: { limit: LIMIT, offset: currentOffset },
          withCredentials: true,
        });

        const filtered = filters.category
          ? res.data.filter(
              (d) =>
                d.category_name === filters.category &&
                (!filters.subCategory || d.sub_category === filters.subCategory)
            )
          : res.data;

        setDonations((prev) => (append ? [...prev, ...filtered] : filtered));
        setHasMore(res.data.length === LIMIT);
      } catch (err) {
        console.error("❌ Failed to fetch donations:", err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    setOffset(0); // reset offset on filters change
    fetchDonations(false, 0);
  }, [filters, fetchDonations]);

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchDonations(true, newOffset);
  };

  const formatDateForDisplay = (isoDateString) => {
    const date = new Date(isoDateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return {
    donations,
    formatDateForDisplay,
    loading,
    hasMore,
    loadMore,
    setFilters,
    filters,
  };
};
