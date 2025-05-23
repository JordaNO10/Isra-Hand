import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEditUser } from "./userEditUser";


export const useRequestorDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [availableDonations, setAvailableDonations] = useState([]);
  const [unacceptedRequests, setUnacceptedRequests] = useState([]);
  const [acceptedDonations, setAcceptedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserId = Cookies.get("userId");
  const editUserHook = useEditUser(userData, setUserData);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      try {
        const [userRes, availableRes, allRes] = await Promise.all([
          axios.get(`/users/${currentUserId}`, { withCredentials: true }),
          axios.get("/donations/available"),
          axios.get("/donations"),
        ]);

        setUserData(userRes.data);
        setAvailableDonations(availableRes.data);

        const unaccepted = allRes.data.filter(
          (d) => d.requestor_id === Number(currentUserId) && d.accepted === 0
        );
        setUnacceptedRequests(unaccepted);

        const accepted = allRes.data.filter(
          (d) => d.requestor_id === Number(currentUserId) && d.accepted === 1
        );
        setAcceptedDonations(accepted);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchDonations();
    }
  }, [currentUserId]);

  const requestDonation = async (donationId) => {
    try {
      await axios.put(`/donations/${donationId}/request`, {
        requestor_id: currentUserId,
      });
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
      await refreshData();
    } catch (err) {
      alert("Failed to cancel request: " + err.response?.data?.error);
    }
  };

  const markAsAccepted = async (donationId) => {
    try {
      await axios.put(`/donations/${donationId}/accept`, {
        requestor_id: currentUserId,
      });
      await refreshData();
    } catch (err) {
      alert("Failed to mark donation as accepted.");
    }
  };

  const refreshData = async () => {
    try {
      const [availableRes, allRes] = await Promise.all([
        axios.get("/donations/available"),
        axios.get("/donations"),
      ]);
      setAvailableDonations(availableRes.data);

      const unaccepted = allRes.data.filter(
        (d) => d.requestor_id === Number(currentUserId) && d.accepted === 0
      );
      setUnacceptedRequests(unaccepted);

      const accepted = allRes.data.filter(
        (d) => d.requestor_id === Number(currentUserId) && d.accepted === 1
      );
      setAcceptedDonations(accepted);
    } catch (err) {
      setError("Failed to refresh donation data.");
    }
  };

  return {
    userData,
    setUserData,
    availableDonations,
    unacceptedRequests,
    acceptedDonations,
    loading,
    error,
    requestDonation,
    cancelRequest,
    markAsAccepted,
    ...editUserHook,
  };
};
