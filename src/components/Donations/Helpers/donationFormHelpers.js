import axios from "axios";
import Cookies from "js-cookie";

/**
 * שליפת קטגוריות לטופס
 */
export const fetchCategories = async (setCategories) => {
  try {
    const { data } = await axios.get("/categories");
    setCategories(data);
  } catch (err) {
    console.error("שגיאה בשליפת קטגוריות:", err);
  }
};

/** ולידציה לשדות חיוניים */
const isFormValid = (f, file) =>
  f.donation_name &&
  f.description &&
  f.email &&
  f.category_name &&
  f.sub_category_name &&
  f.Phonenumber &&
  !!file;

/** בניית FormData לשליחה */
const buildFormData = (f, file) => {
  const fd = new FormData();
  fd.append("donationname", f.donation_name);
  fd.append("description", f.description);
  fd.append("email", f.email);
  fd.append("Phonenumber", f.Phonenumber);
  fd.append("categoryName", f.category_name);
  fd.append("subCategoryName", f.sub_category_name);
  fd.append("user_id", Cookies.get("userId"));
  fd.append("image", file);
  return fd;
};

/** איפוס טופס לאחר שליחה מוצלחת */
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

/**
 * שליחת טופס תרומה (כולל העלאת תמונה)
 * — פונקציה קצרה שקוראת לעזרי־פונקציה לעמידה בכלל <20 שורות —
 */
export const submitDonationForm = async (
  formData,
  selectedFile,
  navigate,
  setFormData,
  setSelectedFile
) => {
  if (!isFormValid(formData, selectedFile)) {
    alert("נא להשלים את כל השדות ולהעלות תמונה.");
    return;
  }
  try {
    await axios.post("/donations", buildFormData(formData, selectedFile), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert("התרומה נוספה בהצלחה!");
    resetForm(setFormData, setSelectedFile);
    navigate("/Donations");
  } catch (err) {
    console.error("נכשלה הוספת תרומה:", err);
    alert("שגיאה בהוספת תרומה. נסה שוב.");
  }
};

/**
 * שליפת תרומות (לשימוש בדרופדאון)
 */
export const fetchDonationsForDropdown = async (setDonations, setError, setLoading) => {
  try {
    const { data } = await axios.get("/donations");
    setDonations(data);
  } catch (err) {
    setError(err.response?.data?.error || err.message);
  } finally {
    setLoading(false);
  }
};
