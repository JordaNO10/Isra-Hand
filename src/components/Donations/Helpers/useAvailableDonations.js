import { useEffect, useState } from "react";
import axios from "axios";

/** חילוץ קטגוריות ייחודיות מהרשימה */
const getUniqueCategories = (rows) => [
  ...new Map(rows.map((d) => [d.category_id, { id: d.category_id, name: d.category_name }])).values(),
];

/** סינון תרומות לפי חיפוש וקטגוריה (תומך גם donation_name וגם title ליציבות) */
const filterDonations = (rows, term, category) => {
  const t = term.toLowerCase();
  return rows.filter((d) => {
    const name = (d.donation_name || d.title || "").toLowerCase();
    const desc = (d.description || "").toLowerCase();
    const matchSearch = name.includes(t) || desc.includes(t);
    const matchCat = category === "all" || d.category_id === category;
    return matchSearch && matchCat;
  });
};

/**
 * הוק לרשימת תרומות זמינות: טוען, מחשב קטגוריות ומבצע סינון.
 */
const useAvailableDonations = () => {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/donations/available");
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
