/**
 * donationFormHelpers
 * תפקיד: בניית FormData, ולידציה בצד לקוח, שליחת POST /donations, וניהול reset.
 * שינוי לפרויקט: שמות השדות בדיוק כפי שהשרת מצפה להם (donationname, categoryName, subCategoryName),
 *                 הוספת withCredentials + שיפור הודעות שגיאה.
 */
import axios from "axios";
import Cookies from "js-cookie";

const REQUIRED = ["donation_name", "description", "email", "category_name", "sub_category_name", "Phonenumber"];

export const fetchCategories = async (setCategories) => {
  try {
    const { data } = await axios.get("/categories", { withCredentials: true });
    setCategories(data);
  } catch (err) {
    console.error("שגיאה בשליפת קטגוריות:", err);
  }
};

const isFormValid = (f, file) =>
  REQUIRED.every((k) => !!(f?.[k] || "").toString().trim()) && !!file;

const buildFormData = (f, file) => {
  const fd = new FormData();
  // שמות כפי שמצופים בשרת
  fd.append("donationname",   f.donation_name);
  fd.append("description",    f.description);
  fd.append("email",          f.email);
  fd.append("Phonenumber",    f.Phonenumber);
  fd.append("categoryName",   f.category_name);
  fd.append("subCategoryName",f.sub_category_name);
  fd.append("user_id",        Cookies.get("userId") || ""); // שרת מסתדר גם עם NULL/ריק
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
    alert("נא להשלים את כל השדות ולהעלות תמונה.");
    return;
  }
  try {
    await axios.post("/donations", buildFormData(formData, selectedFile), {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    alert("התרומה נוספה בהצלחה!");
    resetForm(setFormData, setSelectedFile);
    navigate("/Donations");
  } catch (err) {
    console.error("נכשלה הוספת תרומה:", err);
    console.log(formData)
    alert("נכשלה הוספת תרומה: " + serverMessage(err));
  }
};

export const fetchDonationsForDropdown = async (setDonations, setError, setLoading) => {
  try {
    const { data } = await axios.get("/donations", { withCredentials: true });
    setDonations(Array.isArray(data) ? data : []);
  } catch (err) {
    setError(serverMessage(err));
  } finally {
    setLoading(false);
  }
};
