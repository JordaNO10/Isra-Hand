// SigninForm.jsx
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const SigninForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post("/signin", {
        emailOrUsername: formData.email,
        password: formData.password,
      });

      Cookies.set("userId", response.data.userId, { expires: 7, secure: true });
      Cookies.set("userRole", response.data.roleId, {
        expires: 7,
        secure: true,
      });

      alert("Signin successful!");
      if (onSuccess) onSuccess();
      window.location.reload();

      setFormData({ email: "", password: "" });
      setErrors({});
    } catch (error) {
      setErrors({
        server:
          error.response?.data?.error || "An error occurred. Please try again.",
      });
    }
  };

  return (
    <form className="inputs-singin" onSubmit={handleSubmit}>
      <input
        className="input"
        type="email"
        name="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={handleInputChange}
        autoComplete="email"
      />
      {errors.email && (
        <span className="text-red-500 text-sm">{errors.email}</span>
      )}

      <input
        className="input"
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        autoComplete="current-password"
      />
      {errors.password && (
        <span className="text-red-500 text-sm">{errors.password}</span>
      )}

      <input className="input login-button" type="submit" value="Sign In" />

      {errors.server && (
        <span className="text-red-500 text-sm">{errors.server}</span>
      )}
    </form>
  );
};

export default SigninForm;
