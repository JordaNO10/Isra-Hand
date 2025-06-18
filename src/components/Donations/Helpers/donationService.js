import axios from "axios";

/**
 * Fetch all donations (used in lists, admin, etc.)
 */
export const getAllDonations = async () => {
  const res = await axios.get("/donations");
  return res.data;
};

/**
 * Fetch all donations (used in lists, admin, etc.)
 */
export const getAvailableDonations = async () => {
  const res = await axios.get("/donations/available");
  return res.data;
};

/**
 * Fetch one donation by ID
 * @param {string|number} id
 */
export const getDonationById = async (id) => {
  const res = await axios.get(`/donations/${id}`);
  return res.data;
};

/**
 * Add a new donation (FormData object)
 */
export const addDonation = async (formDataToSend) => {
  return axios.post("/donationadd", formDataToSend, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Update an existing donation by ID (FormData object)
 */
export const updateDonation = async (id, formData) => {
  return axios.put(`/donations/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Delete a donation by ID
 */
export const deleteDonation = async (id) => {
  return axios.delete(`/donations/${id}`);
};

/**
 * Get the current user's role (expects user to be logged in)
 */
export const getUserRole = async () => {
  const res = await axios.get("/users");
  return res.data[0]?.role_id ?? null;
};
