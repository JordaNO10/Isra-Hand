/**
 * useCategories
 * תפקיד: טעינת קטגוריות ותתי־קטגוריות מהשרת למבנה נוח ל־UI.
 * שינוי: תמיכה בשני פורמטים מהשרת:
 *   1) פורמט "מנורמל" עם group_id + subCategories[]
 *   2) פורמט "שטוח" (category_id + category_name + sub_category לשורה)
 */

import { useState, useEffect } from "react";
import axios from "axios";

// טרנספורמציית פורמט 1: server groups => {category_id, category_name, subCategories[]}
const fromGrouped = (raw) =>
  raw.map((g) => ({
    category_id: g.group_id,
    category_name: g.category_name,
    subCategories: (g.subCategories || []).map((s) => String(s?.sub_category || "").trim()).filter(Boolean),
  }));

// טרנספורמציית פורמט 2: רשומות שטוחות => קיבוץ לפי category_id
const fromFlat = (rows) => {
  const map = new Map();
  rows.forEach((r) => {
    const id = r.category_id;
    if (!id) return;
    if (!map.has(id)) map.set(id, { category_id: id, category_name: r.category_name, subCategories: [] });
    const sub = String(r.sub_category || "").trim();
    if (sub && !map.get(id).subCategories.includes(sub)) map.get(id).subCategories.push(sub);
  });
  return Array.from(map.values());
};

const transformCategories = (raw) => {
  if (!Array.isArray(raw)) return [];
  // אם יש group_id נניח שזה פורמט 1
  if (raw.length && "group_id" in (raw[0] || {})) return fromGrouped(raw);
  // אחרת נתייחס כפורמט שטוח
  return fromFlat(raw);
};

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    let alive = true;
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
