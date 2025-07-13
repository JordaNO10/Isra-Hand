import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useEditUser = (userData, setUserData) => {
  const [editMode, setEditMode] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const currentUserId = Cookies.get("userId");

  const handleFieldChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEditMode = (field, status) => {
    setEditMode((prev) => ({ ...prev, [field]: status }));
  };

  const saveField = async (field) => {
    try {
      const value = editedUser[field];

      // Send only the edited field
      await axios.put(`/users/${currentUserId}`, {
        [field]: value,
      });

      // Update local state
      setUserData((prev) => ({ ...prev, [field]: value }));
      setEditMode((prev) => ({ ...prev, [field]: false }));
      setEditedUser({});
    } catch (err) {
      console.error("❌ Error updating field:", field, err.response?.data || err.message);
      alert("שגיאה בעדכון המשתמש: " + (err.response?.data?.error || err.message));
    }
  };

  return {
    editMode,
    editedUser,
    toggleEditMode,
    handleFieldChange,
    saveField,
  };
};
