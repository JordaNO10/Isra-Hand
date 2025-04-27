// src/helpers/useDonationDropdown.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDonationsForDropdown } from "./donationFormHelpers";

// Hook for Donation Dropdown (Selection)
export const useDonationDropdown = (currentId) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonationsForDropdown(setDonations, setError, setLoading);
  }, []);

  const groupedDonations = donations.reduce((acc, donation) => {
    if (donation.donation_id.toString() === currentId.toString()) return acc;

    if (!acc[donation.category_name]) {
      acc[donation.category_name] = [];
    }
    acc[donation.category_name].push(donation);
    return acc;
  }, {});

  return {
    loading,
    error,
    groupedDonations,
  };
};

// Hook for Donation Navigation (Dropdown Navigation + Back)
export const useDonationNavigation = (onSelectDonation) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("");

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedId(value);

    if (value) {
      onSelectDonation(value);
      setSelectedId(""); // Reset after selection
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
