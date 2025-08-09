/**
 * donationService
 * תפקיד: שכבת שירות ל־API התרומות.
 * שינוי: addDonation ל-/donations (ולא /donationadd) + withCredentials בכל הקריאות.
 */
import axios from "axios";

const cfg = { withCredentials: true };

export const getAllDonations = async () => {
  const res = await axios.get("/donations", cfg);
  return res.data;
};

export const getAvailableDonations = async () => {
  const res = await axios.get("/donations/available", cfg);
  return res.data;
};

export const getDonationById = async (id) => {
  const res = await axios.get(`/donations/${id}/secure`, cfg);
  return res.data;
};

export const addDonation = async (formDataToSend) => {
  return axios.post("/donations", formDataToSend, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

export const updateDonation = async (id, formData) => {
  return axios.put(`/donations/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

export const deleteDonation = async (id) => {
  return axios.delete(`/donations/${id}`, cfg);
};

// עדיף בצד לקוח לקרוא מתוקף העוגיות; מוסיף כאן רק אם נדרש
export const getUserRole = async () => {
  try {
    const res = await axios.get("/users/me", cfg); // אם קיים אצלך
    return res.data?.role_id ?? null;
  } catch {
    return null;
  }
};
