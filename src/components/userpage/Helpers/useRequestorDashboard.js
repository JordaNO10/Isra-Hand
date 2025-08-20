/**
 * useRequestorDashboard:
 * Hook עזר לניהול דשבורד מבקש תרומות.
 * כולל שליפת נתוני משתמש, תרומות זמינות, בקשות לא מאושרות, תרומות שהתקבלו, ופעולות (בקשה/ביטול/קבלה).
 */
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
        const [userRes, availableRes, allRes, acceptedRes] = await Promise.all([
          axios.get(`/users/${currentUserId}`, { withCredentials: true }),
          axios.get("/donations/available"),
          axios.get("/donations"),
          axios.get(`/donations/requestor-accepted/${currentUserId}`),
        ]);

        setUserData(userRes.data);
        setAvailableDonations(availableRes.data);

        const unaccepted = allRes.data.filter(
          (d) => d.requestor_id === Number(currentUserId) && d.accepted === 0
        );
        setUnacceptedRequests(unaccepted);

        setAcceptedDonations(acceptedRes.data);
      } catch {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchDonations();
    }
  }, [currentUserId]);

  // בקשת תרומה
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

  // ביטול בקשה
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

  // סימון תרומה כמאושרת
  const markAsAccepted = async (donationId) => {
    try {
      await axios.put(`/donations/${donationId}/accept`, {
        requestor_id: currentUserId,
      });
      await refreshData();
    } catch {
      alert("Failed to mark donation as accepted.");
    }
  };

  // ריענון נתונים
  const refreshData = async () => {
    try {
      const [availableRes, allRes, acceptedRes] = await Promise.all([
        axios.get("/donations/available"),
        axios.get("/donations"),
        axios.get(`/donations/requestor-accepted/${currentUserId}`),
      ]);

      setAvailableDonations(availableRes.data);

      const unaccepted = allRes.data.filter(
        (d) => d.requestor_id === Number(currentUserId) && d.accepted === 0
      );
      setUnacceptedRequests(unaccepted);

      setAcceptedDonations(acceptedRes.data);
    } catch {
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
