/**
 * donationFormHelpers
 * תפקיד: בניית FormData, ולידציה בצד לקוח, שליחת POST /donations, וניהול reset.
 * שינוי: החלפת alert ב־toast (react-toastify) להודעות ידידותיות.
 */
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const REQUIRED = ["donation_name", "description", "email", "category_name", "sub_category_name", "Phonenumber"];

export const fetchCategories = async (setCategories) => {
  try {
    const { data } = await axios.get("/categories", { withCredentials: true });
    setCategories(data);
  } catch (err) {
    console.error("שגיאה בשליפת קטגוריות:", err);
    toast.error("שגיאה בשליפת קטגוריות");
  }
};

const isFormValid = (f, file) =>
  REQUIRED.every((k) => !!(f?.[k] || "").toString().trim()) && !!file;

const buildFormData = (f, file) => {
  const fd = new FormData();
  fd.append("donationname",   f.donation_name);
  fd.append("description",    f.description);
  fd.append("email",          f.email);
  fd.append("Phonenumber",    f.Phonenumber);
  fd.append("categoryName",   f.category_name);
  fd.append("subCategoryName",f.sub_category_name);
  fd.append("user_id",        Cookies.get("userId") || "");
  if (file) fd.append("image", file);
  return fd;
};

const resetForm = (setFormData, setSelectedFile) => {
  setFormData({
    donation_name: "",
    description: "",
    email: "",
    category_name: "",
    sub_category_name: "",
    Phonenumber: "",
  });
  setSelectedFile(null);
};

const serverMessage = (err) =>
  err?.response?.data?.error || err?.response?.data?.message || err?.message || "שגיאה לא ידועה";

export const submitDonationForm = async (formData, selectedFile, navigate, setFormData, setSelectedFile) => {
  if (!isFormValid(formData, selectedFile)) {
    toast.warn("נא להשלים את כל השדות ולהעלות תמונה.");
    return;
  }
  try {
    await axios.post("/donations", buildFormData(formData, selectedFile), {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    toast.success("✅ התרומה נוספה בהצלחה!");
    resetForm(setFormData, setSelectedFile);
  } catch (err) {
    console.error("נכשלה הוספת תרומה:", err);
    toast.error("❌ נכשל בהוספת תרומה: " + serverMessage(err));
  }
};

export const fetchDonationsForDropdown = async (setDonations, setError, setLoading) => {
  try {
    const { data } = await axios.get("/donations", { withCredentials: true });
    setDonations(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(serverMessage(err));
    toast.error("שגיאה בשליפת תרומות");
  } finally {
    setLoading(false);
  }
};
