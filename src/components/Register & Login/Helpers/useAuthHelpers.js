// src/Helpers/useAuthHelpers.js
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const useAuthHelpers = (navigate) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (formData, passwordValid) => {
    if (!passwordValid) {
      setErrorMessage("הסיסמה לא עומדת בדרישות.");
      toast.error("הסיסמה לא עומדת בדרישות.", { autoClose: 8000 });
      return;
    }

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post("/users/register", formDataToSend, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setErrorMessage("");
        toast.success(
          "הרשמה בוצעה בהצלחה. אנא אמת את כתובת האימייל שלך כדי להתחבר.",
          { autoClose: 8000 }
        );
        navigate("/Signin");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "שגיאה בהרשמה";
      setErrorMessage(errMsg);
      toast.error(errMsg, { autoClose: 8000 });
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      const response = await axios.post(
        "/users/forgot-password",
        { email },
        { withCredentials: true }
      );
      toast.success(response.data.message || "קישור איפוס נשלח למייל", {
        autoClose: 8000,
      });
      setErrorMessage("");
      navigate("/Signin");
    } catch (error) {
      const errMsg = error.response?.data?.error || "שגיאה בשליחת קישור איפוס";
      setErrorMessage(errMsg);
      toast.error(errMsg, { autoClose: 8000 });
    }
  };

  return {
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleSignup,
    handleForgotPassword,
  };
};
