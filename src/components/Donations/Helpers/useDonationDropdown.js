import { useState, useEffect } from "react";
import axios from "axios";

export const useDonationDropdown = (currentId) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/donations/available", {
          withCredentials: true,
        });
        if (Array.isArray(res.data)) {
          setDonations(res.data);
        } else {
          setError("Invalid donation data format");
        }
      } catch (err) {
        console.error("Error fetching donations:", err);
        setError("Failed to load donations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const groupedDonations = donations.reduce((acc, donation) => {
  const categoryId = donation.category_id;
  const categoryName = donation.category_name || "ללא שם";
  const subCategory = donation.sub_category_name;

  if (!categoryId) return acc;

  if (!acc[categoryId]) {
    acc[categoryId] = {
      category_name: categoryName,
      subCategories: [],
    };
  }

  if (subCategory && !acc[categoryId].subCategories.includes(subCategory)) {
    acc[categoryId].subCategories.push(subCategory);
  }

  return acc;
}, {});

  return {
    loading,
    error,
    groupedDonations,
  };
};
