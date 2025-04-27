// src/helpers/useDonationsPage.js
import { useState, useEffect } from "react";
import { getAllDonations, getUserRole } from "./donationService";

export const useDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchDonationsAndUser = async () => {
      try {
        const donationsData = await getAllDonations();
        const role = await getUserRole();
        setDonations(donationsData);
        setUserRole(role);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationsAndUser();
  }, []);

  return {
    donations,
    loading,
    userRole,
  };
};
