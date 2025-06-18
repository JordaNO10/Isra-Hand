import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useResetPassword = (token) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("הסיסמאות אינן תואמות");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`/users/reset-password/${token}`, {
        password,
      });
      alert(res.data.message || "הסיסמה אופסה בהצלחה!");
      navigate("/Signin");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "שגיאה באיפוס הסיסמה");
    } finally {
      setLoading(false);
    }
  };

  return {
    password,
    confirmPassword,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    loading,
    errorMessage,
  };
};
