import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useRequestorDashboard = () => {
  const [availableDonations, setAvailableDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserId = Cookies.get("userId");

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const [availableRes, allRes] = await Promise.all([
          axios.get("/donations/available"),
          axios.get("/donations"),
        ]);

        setAvailableDonations(availableRes.data);

        const userRequested = allRes.data.filter(
          (d) => d.requestor_id === Number(currentUserId)
        );
        setMyRequests(userRequested);
      } catch (err) {
        setError("Failed to load donation data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [currentUserId]);

  const requestDonation = async (donationId) => {
    try {
      await axios.put(`/donations/${donationId}/request`, {
        requestor_id: currentUserId,
      });
      // Refresh
      await refreshData();
    } catch (err) {
      alert("Failed to request donation: " + err.response?.data?.error);
    }
  };

  const cancelRequest = async (donationId) => {
    try {
      await axios.put(`/donations/${donationId}/cancel`, {
        requestor_id: currentUserId,
      });
      // Refresh
      await refreshData();
    } catch (err) {
      alert("Failed to cancel request: " + err.response?.data?.error);
    }
  };

  const refreshData = async () => {
    try {
      const [availableRes, allRes] = await Promise.all([
        axios.get("/donations/available"),
        axios.get("/donations"),
      ]);
      setAvailableDonations(availableRes.data);
      const userRequested = allRes.data.filter(
        (d) => d.requestor_id === Number(currentUserId)
      );
      setMyRequests(userRequested);
    } catch (err) {
      setError("Failed to refresh donation data.");
    }
  };

  return {
    availableDonations,
    myRequests,
    loading,
    error,
    requestDonation,
    cancelRequest,
  };
};
