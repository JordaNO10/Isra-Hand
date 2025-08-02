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

        // console.log("✅ Grouped categories from backend:", res.data);

        const formatted = res.data.map((group) => ({
          category_name: group.category_name,
          category_id: group.group_id,
          subCategories: group.subCategories
            .map((s) => s.sub_category?.trim())
            .filter(Boolean),
        }));

        //  console.log("✅ Final parsed categories:", formatted);
        setCategories(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch categories:", err);
        setError("בעיה בטעינת הקטגוריות");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
