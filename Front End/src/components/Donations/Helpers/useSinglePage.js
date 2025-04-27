// src/helpers/useSinglePage.js
import { useState, useEffect } from "react";
import {
  getDonationById,
  updateDonation,
  deleteDonation,
} from "./donationService";
import { useNavigate, useParams } from "react-router-dom";

export const useSinglePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donationData, setDonationData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const data = await getDonationById(id);
        setDonationData(data);
        setEditedData(data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const handleEdit = () => setIsEditing(true);

  const handleSave = async (data) => {
    const formData = new FormData();
    formData.append("donation_name", data.donation_name);
    formData.append("description", data.description);
    formData.append("email", data.email);

    if (data.image instanceof File) {
      formData.append("image", data.image);
    }

    try {
      const updated = await updateDonation(id, formData);
      setDonationData(updated);
      setEditedData(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
    window.location.reload();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await deleteDonation(id);
        alert("Donation deleted successfully!");
        navigate("/Donations");
      } catch (err) {
        console.error("Error deleting donation:", err);
        setError(err.response?.data?.error || err.message);
      }
    }
  };

  const handleDropdownChange = (selectedId) => {
    if (selectedId) {
      navigate(`/donations/${selectedId}`);
    }
  };

  return {
    id,
    donationData,
    editedData,
    isModalOpen,
    isEditing,
    loading,
    error,
    openModal,
    closeModal,
    handleEdit,
    handleSave,
    handleDelete,
    setEditedData,
    handleDropdownChange,
  };
};
