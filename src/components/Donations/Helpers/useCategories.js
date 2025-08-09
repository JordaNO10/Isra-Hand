import { useState, useEffect } from "react";
import axios from "axios";

/** טרנספורמציית פורמט קטגוריות מהשרת למבנה הקל לשימוש ב־UI */
const transformCategories = (raw) =>
  raw.map((group) => ({
    category_name: group.category_name,
    category_id: group.group_id,
    subCategories: (group.subCategories || [])
      .map((s) => s.sub_category?.trim())
      .filter(Boolean),
  }));

/**
 * הוק לטעינת קטגוריות ותתי־קטגוריות מהשרת.
 * כולל הודעות שגיאה בעברית ומבנה נתונים נוח לרכיבי בחירה.
 */
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true; // מניעת setState לאחר unmount
    (async () => {
      try {
        const res = await axios.get("/categories", { withCredentials: true });
        if (!alive) return;
        setCategories(transformCategories(res.data || []));
      } catch (err) {
        console.error("❌ שגיאה בטעינת קטגוריות:", err);
        if (alive) setError("בעיה בטעינת הקטגוריות");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { categories, loading, error };
};
