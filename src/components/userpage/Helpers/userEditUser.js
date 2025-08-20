/**
 * Hook עזר לעריכת פרטי משתמש ועדכון בשרת.
 * כולל ניהול מצב עריכה, שמירת שינויים ועדכון סטייט מקומי.
 */
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useEditUser = (userData, setUserData) => {
  const [editMode, setEditMode] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const currentUserId = Cookies.get("userId");

  // שינוי ערך בשדה
  const handleFieldChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  // הפעלה/כיבוי מצב עריכה לשדה מסוים
  const toggleEditMode = (field, status) => {
    setEditMode((prev) => ({ ...prev, [field]: status }));
  };

  // שמירת ערך בשרת + עדכון סטייט מקומי
  const saveField = async (field) => {
    try {
      const value = editedUser[field];

      await axios.put(`/users/${currentUserId}`, {
        [field]: value,
      });

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
