import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./css/signin.css";

const DropdownSignin = ({ setShowForm }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic validation
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Log form data for debugging
      console.log("Submitting form data:", formData);

      const response = await axios.post("/signIn", {
        emailOrUsername: formData.email,
        password: formData.password,
      });

      // Log response for debugging
      console.log("Signin response:", response.data);

      alert("Signin successful!");
      Cookies.set("userId", response.data.userId, { expires: 7, secure: true });

      // Hide the dropdown only after successful login
      setShowForm(false);

      // Refresh the page after successful login
      window.location.reload();

      // Reset form and errors
      setFormData({ email: "", password: "" });
      setErrors({});
    } catch (error) {
      console.error("Signin error:", error); // Log error to the console
      setErrors({
        server:
          error.response?.data?.error || "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="signin-dropdown">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold">Sign In</div>
        <button className="close-button" onClick={() => setShowForm(false)}>
          ✖
        </button>
      </div>
      <form className="inputs-singin" onSubmit={handleSubmit}>
        <input
          required
          className="input"
          type="email"
          name="email"
          id="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleInputChange}
          autoComplete="email"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
        <input
          required
          className="input"
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          autoComplete="current-password"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}
        <span className="text-blue-500 text-sm">
          <a href="#">Forgot Password?</a>
        </span>
        <input className="input login-button" type="submit" value="Sign In" />
        {errors.server && (
          <span className="text-red-500 text-sm">{errors.server}</span>
        )}
      </form>
    </div>
  );
};

export default DropdownSignin;
