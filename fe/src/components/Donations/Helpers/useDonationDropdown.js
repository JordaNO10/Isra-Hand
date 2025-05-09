import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDonationsForDropdown } from "./donationFormHelpers";

/**
 * Dropdown logic: fetches and groups donations by category name
 */
export const useDonationDropdown = (currentId) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonationsForDropdown(setDonations, setError, setLoading);
  }, []);

  const groupedDonations = donations.reduce((acc, donation) => {
    if (donation.donation_id.toString() === currentId.toString()) return acc;

    const group = donation.category_name || "Uncategorized";
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

/**
 * Navigation logic for dropdown switch + back
 */
export const useDonationNavigation = (onSelectDonation) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedId(value);

    if (value) {
      onSelectDonation(value);
      setSelectedId(""); // Reset
    }
  };

  const handleBackClick = () => {
    navigate("/donations");
  };

  return {
    selectedId,
    handleSelectChange,
    handleBackClick,
  };
};
