import { useEffect, useState } from "react";
import axios from "axios";

const useAvailableDonations = () => {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchAvailableDonations = async () => {
      try {
        const res = await axios.get("/donations/available");
        setAvailableDonations(res.data);
        setFilteredDonations(res.data);

        // Extract unique categories
        const unique = [
          ...new Map(
            res.data.map((d) => [
              d.category_id,
              { id: d.category_id, name: d.category_name },
            ])
          ).values(),
        ];
        setCategories(unique);
      } catch (err) {
        console.error("Error fetching donations:", err);
      }
    };

    fetchAvailableDonations();
  }, []);

  useEffect(() => {
    const filtered = availableDonations.filter((donation) => {
      const matchSearch =
        donation.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "all" || donation.category_id === selectedCategory;
      return matchSearch && matchCategory;
    });

    setFilteredDonations(filtered);
  }, [availableDonations, searchTerm, selectedCategory]);

  return {
    filteredDonations,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
  };
};

export default useAvailableDonations;
