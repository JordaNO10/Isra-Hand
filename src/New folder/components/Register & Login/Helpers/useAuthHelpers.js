// src/Helpers/useAuthHelpers.js
import { useState } from "react";
import axios from "axios";

export const useAuthHelpers = (navigate) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (formData, passwordValid) => {
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
      alert(response.data.message || "קישור איפוס נשלח למייל");
      setErrorMessage("");
      navigate("/Signin");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "שגיאה בשליחת קישור איפוס"
      );
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
