/**
 * useEditActions
 * אחריות: עריכה/שמירה/מחיקה של תרומה.
 */
import { useState } from "react";
import { getDonationById, updateDonation, deleteDonation } from "../../Helpers/donationService";

/** בניית FormData לעדכון תרומה */
const buildFormData = (d) => {
  const fd = new FormData();
  fd.append("donation_name", d.donation_name);
  fd.append("email", d.email);
  fd.append("description", d.description);
  if (d.image instanceof File) fd.append("image", d.image);
  return fd;
};

export const useEditActions = (id, donationData, setDonationData) => {
  const [editedData, setEditedData] = useState({});
  const [isEditing, setIsEditing]   = useState(false);

  const handleEdit = () => { setEditedData(donationData); setIsEditing(true); };

  const handleSave = async (updated) => {
    try {
      await updateDonation(id, buildFormData(updated));
      const fresh = await getDonationById(id);
      setDonationData(fresh);
      setIsEditing(false);
      window.location.reload();
      alert("השינויים נשמרו בהצלחה!");
    } catch (e) {
      console.error("❌ שמירת תרומה נכשלה:", e);
      alert("שמירת תרומה נכשלה");
    }
  };

  const handleDelete = async () => {
    try { await deleteDonation(id); window.location.href = "/donations"; }
    catch { alert("מחיקת תרומה נכשלה"); }
  };

  return { editedData, setEditedData, isEditing, handleEdit, handleSave, handleDelete };
};
