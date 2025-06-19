import axios from "axios";
import {
  getAllDonations,
  getAvailableDonations,
} from "../../Donations/Helpers/donationService";
import Cookies from "js-cookie";

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
  const allDonations = await getAvailableDonations();
  console.log(allDonations);

  let updatedDonations = allDonations;

  const target = allDonations.find((d) => d.requestor_id !== null);
  if (target) {
    updatedDonations = allDonations.filter((d) => d !== target);
  }

  // Sort by most recent donation_date
  const sorted = [...updatedDonations].sort(
    (a, b) => new Date(b.donation_date) - new Date(a.donation_date)
  );

  // Format top 8 donation dates
  const latest = sorted.slice(0, 8).map((donation) => ({
    ...donation,
    donation_date_formatted: formatDateForDisplay(donation.donation_date),
  }));

  return {
    latest,
    total: updatedDonations.length,
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

/**
 * Checks if the current user is logged in and has the 'Donor' role
 */
export const isUserDonor = () => {
  const role = Cookies.get("userRole");
  return role === "2";
};

/**
 * Checks if the current user is logged in and has the 'Requestor' role
 */
export const isUserRequestor = () => {
  const role = Cookies.get("userRole");
  return role === "3";
};
