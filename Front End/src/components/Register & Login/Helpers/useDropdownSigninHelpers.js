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
        Cookies.set("userId", response.data.userId);
        Cookies.set("userRole", response.data.roleId);

        setErrorMessage("");
        setShowForm(false);
        handleLoginSuccess(); 

        navigate("/"); 
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.status !== 200) {
        setErrorMessage(error.response?.data?.error || "שגיאה בהתחברות");
      }
    }
  };

  return {
    formData,
    errorMessage,
    handleInputChange,
    handleSubmit,
  };
};
