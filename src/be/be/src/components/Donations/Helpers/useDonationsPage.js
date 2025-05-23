import { useState, useEffect } from "react";
import { getAllDonations, getUserRole } from "./donationService";
import { isDonor, isDonationOwner } from "./donationAccessControl";
import Cookies from "js-cookie";

/**
 * Hook for managing donations listing + role check
 */
export const useDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchDonationsAndUser = async () => {
      try {
        const donationsData = await getAllDonations();
        const role = await getUserRole();
        const currentUserId = Cookies.get("userId");

        // If donor, show only own donations
        const filtered =
          role === 2
            ? donationsData.filter(
                (don) => String(don.user_id) === String(currentUserId)
              )
            : donationsData;

        setDonations(filtered);
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
