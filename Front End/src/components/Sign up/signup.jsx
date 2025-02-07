import React, { useState } from "react";
import axios from "axios"; // Import Axios
import "./css/signup.css";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // Field for role (1 = Donor, 2 = Requestor)
  });

  const [errors, setErrors] = useState({});
  const [isSignUp, setIsSignUp] = useState(true); // State to track if it's sign up or sign in
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to track if passwords match

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordsMatch(password === confirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (isSignUp) {
      // Sign-up logic
      if (!passwordsMatch) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
      if (!formData.role) {
        newErrors.role = "Role is required.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/signup", {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: formData.role, // Use the role selected (1 or 2)
        });
        alert(response.data.message);
        // Clear form data only after successful signup
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "", // Reset role
        });
        setErrors({});
      } catch (error) {
        if (error.response) {
          alert("Signup failed: " + error.response.data.error);
        } else if (error.request) {
          alert(
            "Signup failed: No response from server. Please check your server."
          );
        } else {
          alert("Signup failed: " + error.message);
        }
      }
    } else {
      // Sign-in logic
      if (!formData.email) newErrors.email = "Email is required.";
      if (!formData.password) newErrors.password = "Password is required.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      try {
        const response = await axios.post("http://localhost:5000/api/signin", {
          email: formData.email,
          password: formData.password,
        });
        alert("Signin successful!");
        // Clear form data only after successful signin
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "", // Reset role
        });
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
    }
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
              autoComplete="given-name"
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
              autoComplete="family-name"
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

      {isSignUp && (
        <>
          <label>
            <input
              required
              placeholder="אימות סיסמא"
              type="password"
              className={`input ${!passwordsMatch ? "input-error" : ""}`}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </label>

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
              <option value="Donor">תורם</option> {/* Donor */}
              <option value="Requestor">מבקש תרומה</option> {/* Requestor */}
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
