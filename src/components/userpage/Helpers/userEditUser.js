import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useEditUser = (userData, setUserData) => {
  const [editMode, setEditMode] = useState({ full_name: false, email: false });
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
      await axios.put(`/users/${currentUserId}`, {
        ...userData,
        ...editedUser,
      });
      setEditMode((prev) => ({ ...prev, [field]: false }));
      setUserData((prev) => ({ ...prev, ...editedUser }));
      setEditedUser({});
    } catch (err) {
      alert("שגיאה בעדכון המשתמש");
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
