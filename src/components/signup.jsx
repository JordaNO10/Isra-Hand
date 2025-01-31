import React, { useState } from "react";
import "../css/signup.css";

const SignupPage = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    role: "", // Donor or Requestor
    userName: "",
    password: "",
    email: "",
    dateOfBirth: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate password
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return regex.test(password);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    if (!formData.role) newErrors.role = "Please select a role.";
    if (!formData.userName) newErrors.userName = "Full name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required.";
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
    }

    // Validate Donor-specific fields
    if (formData.role === "Donor") {
      if (!formData.phoneNumber)
        newErrors.phoneNumber = "Phone number is required.";
      if (!formData.address) newErrors.address = "Address is required.";
    }

    // If there are errors, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add the new user to localStorage
    const newUser = { ...formData };

    // Retrieve existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Add the new user to the list
    const updatedUsers = [...existingUsers, newUser];

    // Save the updated list back to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Reset the form
    setFormData({
      role: "",
      userName: "",
      password: "",
      email: "",
      dateOfBirth: "",
      phoneNumber: "",
      address: "",
    });

    setErrors({});
    alert("Signup successful!");
  };

  return (
    <div className="signup-page">
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        {/* Role Selection */}
        <div className="form-group">
          <label>Role:</label>
          <div>
            <label>
              <input
                type="radio"
                name="role"
                value="Donor"
                checked={formData.role === "Donor"}
                onChange={handleInputChange}
              />
              Donor
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Requestor"
                checked={formData.role === "Requestor"}
                onChange={handleInputChange}
              />
              Requestor
            </label>
          </div>
          {errors.role && <span className="error">{errors.role}</span>}
        </div>

        {/* User name */}
        <div className="form-group">
          <label htmlFor="userName">User Name:</label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            required
          />
          {errors.userName && <span className="error">{errors.userName}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
          {errors.dateOfBirth && (
            <span className="error">{errors.dateOfBirth}</span>
          )}
        </div>

        {/* Phone Number (Always Visible) */}
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required={formData.role === "Donor"} // Required only for Donor
          />
          {errors.phoneNumber && (
            <span className="error">{errors.phoneNumber}</span>
          )}
        </div>

        {/* Address (Always Visible) */}
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required={formData.role === "Donor"} // Required only for Donor
          />
          {errors.address && <span className="error">{errors.address}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
