/**
 * useDonationDropdown
 * תפקיד: שליפת תרומות זמינות וארגון לדרופדאון לפי קטגוריות.
 * שינוי: תמיכה בשם תת־קטגוריה גם ב־sub_category_name וגם ב־sub_category.
 */
import { useState, useEffect } from "react";
import axios from "axios";

const groupDonations = (donations) =>
  donations.reduce((acc, d) => {
    const categoryId = d.category_id;
    const categoryName = d.category_name || "ללא שם";
    const sub = d.sub_category_name || d.sub_category;
    if (!categoryId) return acc;
    if (!acc[categoryId]) acc[categoryId] = { category_name: categoryName, subCategories: [] };
    if (sub && !acc[categoryId].subCategories.includes(sub)) acc[categoryId].subCategories.push(sub);
    return acc;
  }, {});

export const useDonationDropdown = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/donations/available", { withCredentials: true });
        if (Array.isArray(data)) setDonations(data);
        else setError("פורמט נתונים שגוי.");
      } catch (err) {
        console.error("שגיאה בשליפת תרומות:", err);
        setError("טעינת תרומות נכשלה.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { loading, error, groupedDonations: groupDonations(donations) };
};
