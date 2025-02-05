import React, { useState } from "react";
import "../css/signup.css";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // New field for role (Donor or Requestor)
  });

  const [errors, setErrors] = useState({});
  const [isSignUp, setIsSignUp] = useState(true); // State to track if it's sign up or sign in
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track if passwords match

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Check if passwords match whenever password or confirmPassword changes
    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordsMatch(password === confirmPassword);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (isSignUp) {
      // Validate required fields for sign up
      if (!formData.firstName) newErrors.firstName = "First name is required.";
      if (!formData.lastName) newErrors.lastName = "Last name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.password) newErrors.password = "Password is required.";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";
      if (!formData.role) newErrors.role = "Please select a role."; // Validate role
    } else {
      // Validate required fields for sign in
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.password) newErrors.password = "Password is required.";
    }

    // If errors exist, stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isSignUp) {
      // Save user data to localStorage for sign up
      const newUser = { ...formData };
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      localStorage.setItem(
        "users",
        JSON.stringify([...existingUsers, newUser])
      );
      alert("Signup successful!");
    } else {
      // Handle sign in logic
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const user = existingUsers.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );
      if (user) {
        alert("Signin successful!");
      } else {
        alert("Invalid email or password.");
      }
    }

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "", // Reset role
    });

    setErrors({});
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="title">{isSignUp ? "Register" : "Sign In"}</p>
      <p className="message">
        {isSignUp
          ? "Signup now and get full access to our app."
          : "Signin to access your account."}
      </p>

      {isSignUp && (
        <div className="flex">
          <label>
            <input
              required
              placeholder="שם פרטי"
              type="text"
              className="input"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && (
              <span className="error">{errors.firstName}</span>
            )}
          </label>

          <label>
            <input
              required
              placeholder="שם משפחה"
              type="text"
              className="input"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && (
              <span className="error">{errors.lastName}</span>
            )}
          </label>
        </div>
      )}

      <label>
        <input
          required
          placeholder="אימייל"
          type="email"
          className="input"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
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
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </label>

      {isSignUp && (
        <>
          <label>
            <input
              required
              placeholder="אימות סיסמא"
              type="password"
              className={`input ${!passwordsMatch ? "input-error" : ""}`} // Add error class if passwords don't match
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </label>

          {/* Role Selection Dropdown */}
          <label>
            <select
              required
              className="input"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                בחר סוג משתמש
              </option>
              <option value="Donor">תורם</option>
              <option value="Requestor">מבקש תרומה</option>
            </select>
            <span>סוג משתמש</span>
            {errors.role && <span className="error">{errors.role}</span>}
          </label>
        </>
      )}

      <button className="submit" type="submit">
        {isSignUp ? "Submit" : "Sign In"}
      </button>
      <p className="signin">
        {isSignUp ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          className="link-button"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? "Signin" : "Signup"}
        </button>
      </p>
    </form>
  );
};

export default SignupPage;
