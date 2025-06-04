import axios from "axios";
import { getAllDonations } from "../../Donations/Helpers/donationService";

/**
 * Fetch latest 3 donations, and all donations for counting
 */

const formatDateForDisplay = (isoDateString) => {
  const date = new Date(isoDateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

/**
 * Fetch latest 8 donations, formatted for homepage display
 */
export const fetchHomepageDonations = async () => {
  const allDonations = await getAllDonations();
  // console.log(allDonations);

  // Sort by most recent donation_date
  const sorted = [...allDonations].sort(
    (a, b) => new Date(b.donation_date) - new Date(a.donation_date)
  );

  // Format top 8 donation dates
  const latest = sorted.slice(0, 8).map((donation) => ({
    ...donation,
    donation_date_formatted: formatDateForDisplay(donation.donation_date),
  }));

  return {
    latest,
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
