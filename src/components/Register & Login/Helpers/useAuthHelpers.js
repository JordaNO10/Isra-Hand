// src/Helpers/useAuthHelpers.js
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useAuthHelpers = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (formData, passwordValid, navigate) => {
    if (!passwordValid) {
      setErrorMessage("הסיסמה לא עומדת בדרישות.");
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
        alert("הרשמה בוצעה בהצלחה. אנא אמת את כתובת האימייל שלך כדי להתחבר.");
        navigate("/Signin");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "שגיאה בהרשמה");
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      const response = await axios.post(
        "/users/forgot-password",
        { email },
        { withCredentials: true }
      );
      setErrorMessage("");
      return { success: true, message: response.data?.message || "" };
    } catch (error) {
      const errorText =
        error.response?.data?.error || "שגיאה בשליחת קישור איפוס";
      setErrorMessage(errorText);
      return { success: false, message: errorText };
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
