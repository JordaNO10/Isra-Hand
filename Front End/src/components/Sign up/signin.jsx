import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Change to useNavigate

const SigninPage = ({ onSignup }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
      const response = await axios.post("/signIn", {
        emailOrUsername: formData.email,
        password: formData.password,
      });
      alert("Signin successful!");

      // Set cookie with userId
      Cookies.set("userId", response.data.userId, { expires: 7 });

      navigate("/dashboard"); // Redirect to dashboard
      // Clear form data after successful signin
      setFormData({ email: "", password: "" });
      setErrors({});
    } catch (error) {
      if (error.response) {
        alert("Signin failed: " + error.response.data.error);
      } else if (error.request) {
        alert(
          "Signin failed: No response from server. Please check your server."
        );
      } else {
        alert("Signin failed: " + error.message);
      }
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="title">Sign In</p>
      <label>
        <input
          required
          placeholder="אימייל"
          type="email"
          className="input"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          autoComplete="email"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </label>
      <label>
        <input
          required
          placeholder="סיסמא"
          type="password"
          className="input"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          autoComplete="new-password"
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </label>
      <button className="submit" type="submit">
        התחבר/
      </button>
      <p className="signup">
        <button type="button" className="link-button" onClick={onSignup}>
          הירשמו
        </button>
        ?לא רשומים
      </p>
    </form>
  );
};

export default SigninPage;
