/**
 * useAvailableDonations
 * תפקיד: שליפת תרומות זמינות + סינון לפי חיפוש/קטגוריה.
 * שינוי: withCredentials בקריאת ה־API ועמידות לשדות שם/תיאור חסרים.
 */
import { useEffect, useState } from "react";
import axios from "axios";

const getUniqueCategories = (rows) => [
  ...new Map(rows.map((d) => [d.category_id, { id: d.category_id, name: d.category_name }])).values(),
];

const filterDonations = (rows, term, category) => {
  const t = (term || "").toLowerCase();
  return rows.filter((d) => {
    const name = (d.donation_name || d.title || "").toLowerCase();
    const desc = (d.description || "").toLowerCase();
    const matchSearch = name.includes(t) || desc.includes(t);
    const matchCat = category === "all" || d.category_id === category;
    return matchSearch && matchCat;
  });
};

const useAvailableDonations = () => {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [filteredDonations, setFilteredDonations]   = useState([]);
  const [searchTerm, setSearchTerm]                 = useState("");
  const [selectedCategory, setSelectedCategory]     = useState("all");
  const [categories, setCategories]                 = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/donations/available", { withCredentials: true });
        setAvailableDonations(data);
        setFilteredDonations(data);
        setCategories(getUniqueCategories(data));
      } catch (err) {
        console.error("שגיאה בשליפת תרומות:", err);
      }
    })();
  }, []);

  useEffect(() => {
    setFilteredDonations(filterDonations(availableDonations, searchTerm, selectedCategory));
  }, [availableDonations, searchTerm, selectedCategory]);

  return { filteredDonations, categories, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory };
};

export default useAvailableDonations;
