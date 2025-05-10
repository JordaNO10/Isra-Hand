// src/Helpers/useAuthHelpers.js
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const useAuthHelpers = (navigate) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e, formData, setFormData) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignin = async (formData) => {
    try {
      const response = await axios.post(
        "/users/login",
        {
          emailOrUsername: formData.email, // ✅ THIS small fix
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        Cookies.set("userId", response.data.userId);
        Cookies.set("userRole", response.data.roleId);
        setErrorMessage("");
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "שגיאה בהתחברות");
    }
  };

  const handleSignup = async (formData, passwordValid) => {
    if (!passwordValid) {
      setErrorMessage("הסיסמה לא עומדת בדרישות.");
      return;
    }

    // Create FormData
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
        Cookies.set("userId", response.data.userId);
        Cookies.set("userRole", response.data.roleId);
        setErrorMessage("");
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "שגיאה בהרשמה");
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      await axios.post("/users/forgot-password", { email });
      navigate("/Signin");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "שגיאה בשליחת קישור איפוס"
      );
    }
  };

  return {
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleSignin,
    handleSignup,
    handleForgotPassword,
  };
};
