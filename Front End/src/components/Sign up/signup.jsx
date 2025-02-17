import React, { useState } from "react";
import axios from "axios";
import SigninPage from "./signin";
import { useNavigate } from "react-router-dom"; // Change to useNavigate
import "./css/signup.css";

const SignupPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [isSignUp, setIsSignUp] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

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
        const response = await axios.post("/signUp", {
          username: formData.username,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        alert(response.data.message);

        // Redirect to dashboard after successful signup
        navigate("/dashboard");

        // Clear form data only after successful signup
        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
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
    }
  };

  return (
    <>
      {isSignUp ? (
        <form className="signup form" onSubmit={handleSubmit}>
          <p className="title">הרשמה</p>
          <p className="message">בצע הרשמה על-מנת לגשת לאפליקצייה שלנו</p>
          <div className="flex">
            <label>
              <input
                required
                placeholder="שם משתמש (אנגלית)"
                type="text"
                className="input"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="off"
              />
              {errors.username && (
                <span className="error">{errors.username}</span>
              )}
            </label>
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
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
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
                    בחר/י סוג משתמש
                  </option>
                  <option value="Donor">תורם/ת</option>
                  <option value="Requestor">מבקש/ת</option>
                </select>
                {errors.role && <span className="error">{errors.role}</span>}
              </label>
            </>
          )}
          <button className="submit" type="submit">
            הירשם
          </button>
          <p className="signin">
            <button
              type="button"
              className="link-button"
              onClick={() => setIsSignUp(false)}
            >
              יש לך חשבון?
            </button>
            ?התחבר
          </p>
        </form>
      ) : (
        <SigninPage onSignup={() => setIsSignUp(true)} />
      )}
    </>
  );
};

export default SignupPage;
