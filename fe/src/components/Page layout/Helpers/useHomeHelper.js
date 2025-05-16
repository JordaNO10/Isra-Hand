import axios from "axios";
import { getAllDonations } from "../../Donations/Helpers/donationService";

/**
 * Fetch latest 3 donations, and all donations for counting
 */
export const fetchHomepageDonations = async () => {
  const allDonations = await getAllDonations();
  const sorted = [...allDonations].sort(
    (a, b) => new Date(b.donation_date) - new Date(a.donation_date)
  );

  return {
    latest: sorted.slice(0, 3),
    total: allDonations.length,
  };
};

/**
 * Fetch all users and return counts of donors and requestors
 */
export const fetchUserRoleCounts = async () => {
  const res = await axios.get("/users"); // Use "/api/users" if your backend uses a prefix
  const users = res.data;

  const donors = users.filter((u) => u.role_id === 2).length;
  const requestors = users.filter((u) => u.role_id === 3).length;

  return { donors, requestors };
};
