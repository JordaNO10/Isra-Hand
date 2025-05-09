// FILE: useSinglePage.js (🔒 Lock only after valid access + clearer logic)
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getDonationById,
  deleteDonation,
  updateDonation,
} from "./donationService";
import {
  isDonor,
  isRequestor,
  isDonationOwner,
  isDonationLocked,
  lockDonation,
} from "./donationAccessControl";

export const useSinglePage = () => {
  const { id } = useParams();
  const [donationData, setDonationData] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donation = await getDonationById(id);
        setDonationData(donation);

        const isOwner = isDonationOwner(donation.user_id);
        const isReq = isRequestor();

        const locked = isDonationLocked(id);
        const allowedToView = isOwner || isReq;

        if (!allowedToView) {
          setAccessDenied(true);
          return;
        }

        if (locked && !isOwner) {
          setAccessDenied(true);
          return;
        }

        // Lock it only after granting access
        lockDonation(id);
      } catch (err) {
        setError("Failed to load donation");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEdit = () => {
    setEditedData(donationData);
    setIsEditing(true);
  };

  const handleSave = async (updatedData) => {
    try {
      const updated = await updateDonation(id, updatedData);
      setDonationData(updated);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDonation(id);
      window.location.href = "/donations";
    } catch (err) {
      setError("Failed to delete donation");
    }
  };

  const handleDropdownChange = (newId) => {
    window.location.href = `/donations/${newId}`;
  };

  return {
    id,
    donationData,
    editedData,
    isEditing,
    loading,
    error,
    accessDenied,
    isModalOpen,
    openModal,
    closeModal,
    handleEdit,
    handleSave,
    handleDelete,
    setEditedData,
    handleDropdownChange,
  };
};
