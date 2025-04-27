// src/helpers/donationService.js
import axios from "axios";

export const getAllDonations = async () => {
  const res = await axios.get("/donations");
  return res.data;
};

export const getDonationById = async (id) => {
  const res = await axios.get(`/donations/${id}`);
  return res.data;
};

export const addDonation = async (formData) => {
  return axios.post("/donationadd", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateDonation = async (id, formData) => {
  return axios.put(`/donations/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteDonation = async (id) => {
  return axios.delete(`/donations/${id}`);
};

export const getUserRole = async () => {
  const res = await axios.get("/users");
  return res.data[0]?.role_id ?? null;
};
