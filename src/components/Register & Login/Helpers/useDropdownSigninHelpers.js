// src/Helpers/useDropdownSigninHelpers.js
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export const useDropdownSigninHelpers = (setShowForm, handleLoginSuccess) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const resendVerificationEmail = async () => {
    try {
      const res = await axios.post(
        "/users/resend-verification",
        { email: formData.email },
        { withCredentials: true }
      );
      console.log("✅ Resend response:", res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Failed to resend verification:", error);
      throw error;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrorMessage("אנא מלא את כל השדות");
      return;
    }

    try {
      const response = await axios.post(
        "/users/login",
        {
          emailOrUsername: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);

        Cookies.set("userId", response.data.userId);
        Cookies.set("userRole", response.data.roleId);
        Cookies.set("fullName", response.data.fullName);

        setErrorMessage("");
        setShowForm(false);
        handleLoginSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);

      const serverMsg =
        error.response?.data?.error || error.response?.data?.message;

      if (serverMsg === "Email not verified") {
        setErrorMessage("Email not verified");
      } else {
        setErrorMessage(serverMsg || "שגיאה בהתחברות");
      }
    }
  };

  return {
    formData,
    setFormData,
    errorMessage,
    setErrorMessage,
    handleInputChange,
    handleSubmit,
    resendVerificationEmail,
  };
};
