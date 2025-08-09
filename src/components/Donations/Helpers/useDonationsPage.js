import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const LIMIT = 3;

/** קריאת API פשוטה עם limit/offset */
const fetchAvailable = (offset) =>
  axios.get("/donations/available", { params: { limit: LIMIT, offset }, withCredentials: true });

/** סינון מקומי לפי פילטרים */
const applyFilters = (rows, filters) =>
  filters.category
    ? rows.filter(
        (d) =>
          d.category_name === filters.category &&
          (!filters.subCategory || d.sub_category === filters.subCategory)
      )
    : rows;

/**
 * הוק לעמוד תרומות: טעינה מדורגת, “עוד”, וסינון.
 */
export const useDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({ category: "", subCategory: "" });

  const fetchDonations = useCallback(async (append = false, currentOffset = 0) => {
    try {
      setLoading(true);
      const { data } = await fetchAvailable(currentOffset);
      const filtered = applyFilters(data, filters);
      setDonations((prev) => (append ? [...prev, ...filtered] : filtered));
      setHasMore(data.length === LIMIT);
    } catch (err) {
      console.error("❌ טעינת תרומות נכשלה:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { setOffset(0); fetchDonations(false, 0); }, [filters, fetchDonations]);

  const loadMore = () => { const next = offset + LIMIT; setOffset(next); fetchDonations(true, next); };

  const formatDateForDisplay = (iso) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,"0")}-${String(d.getMonth()+1).padStart(2,"0")}-${d.getFullYear()}`;
  };

  return { donations, formatDateForDisplay, loading, hasMore, loadMore, setFilters, filters };
};
