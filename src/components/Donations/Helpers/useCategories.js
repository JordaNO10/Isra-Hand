import { useState, useEffect } from "react";
import axios from "axios";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/categories", {
          withCredentials: true,
        });
        const formatted = res.data.map((row) => ({
          category_id: row.category_id,
          category_name: row.category_name,
          subCategories: row.subCategories // ✅ correct casing
            ? row.subCategories.map((s) => s.trim())
            : [],
        }));
        setCategories(formatted);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("בעיה בטעינת הקטגוריות");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
