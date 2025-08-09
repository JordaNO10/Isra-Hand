import axios from "axios";

/** שליפת כל התרומות (לרשימות/אדמין וכו') */
export const getAllDonations = async () => {
  const res = await axios.get("/donations");
  return res.data;
};

/** שליפת תרומות זמינות בלבד */
export const getAvailableDonations = async () => {
  const res = await axios.get("/donations/available");
  return res.data;
};

/**
 * שליפת תרומה בודדת לפי מזהה
 * @param {string|number} id
 */
export const getDonationById = async (id) => {
  const res = await axios.get(`/donations/${id}`);
  return res.data;
};

/**
 * הוספת תרומה חדשה (מקבל FormData)
 */
export const addDonation = async (formDataToSend) => {
  return axios.post("/donationadd", formDataToSend, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * עדכון תרומה קיימת לפי מזהה (מקבל FormData)
 */
export const updateDonation = async (id, formData) => {
  return axios.put(`/donations/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/** מחיקת תרומה לפי מזהה */
export const deleteDonation = async (id) => {
  return axios.delete(`/donations/${id}`);
};

/** שליפת תפקיד המשתמש הנוכחי (דורש התחברות) */
export const getUserRole = async () => {
  const res = await axios.get("/users");
  return res.data[0]?.role_id ?? null;
};
