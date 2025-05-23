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
    if (!donation || !donation.donation_id || !donation.donation_name)
      return acc;
    if (currentId && donation.donation_id.toString() === currentId.toString())
      return acc;

    const group = donation.donation_name?.trim() || "ללא קטגוריה";
    if (!acc[group]) acc[group] = [];
    acc[group].push(donation);
    return acc;
  }, {});

  return {
    loading,
    error,
    groupedDonations,
  };
};
