import React, { useState } from "react";
import axios from "axios";
import SigninPage from "./signin";
import { useNavigate } from "react-router-dom";
import "./css/signup.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [isSignUp, setIsSignUp] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValidation({
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
    });

    return (
      minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }

    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordsMatch(password === confirmPassword);
    }
  };

  // Function to handle automatic sign-in after successful signup
  const autoSignIn = async (username, password) => {
    try {
      // Matching the server endpoint and parameter names
      const response = await axios.post("/signin", {
        emailOrUsername: username, // Using the correct parameter name
        password: password,
      });

      // Store user data in session based on your server response
      if (response.data && response.data.userId) {
        console.log("Auto sign-in successful:", response.data);

        // Navigate to dashboard
        navigate("/");
        window.location.reload();
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Auto sign-in failed:", error);
      return false;
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
      if (!validatePassword(formData.password)) {
        newErrors.password = "Password does not meet the requirements.";
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
          birthdate: formData.birthdate, // Added birthdate here
          password: formData.password,
          role: formData.role,
        });
        alert(response.data.message);

        // Auto sign-in after successful signup - store username for sign-in
        const signInSuccess = await autoSignIn(
          formData.username,
          formData.password
        );

        if (!signInSuccess) {
          alert(
            "Registration successful! Please sign in with your new account."
          );
          setIsSignUp(false);
        }

        // Clear form data only after successful signup
        setFormData({
          username: "",
          firstName: "",
          lastName: "",
          email: "",
          birthdate: "", // Clear birthdate as well
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
        <form className="signup-form" onSubmit={handleSubmit}>
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
              type="date"
              className="input"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
            />
            {errors.birthdate && (
              <span className="error">{errors.birthdate}</span>
            )}
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
            <div className="password-requirements">
              <p>Password must contain:</p>
              <ul>
                <li className={passwordValidation.minLength ? "valid" : ""}>
                  At least 8 characters
                </li>
                <li className={passwordValidation.hasUpperCase ? "valid" : ""}>
                  At least one uppercase letter (A-Z)
                </li>
                <li className={passwordValidation.hasLowerCase ? "valid" : ""}>
                  At least one lowercase letter (a-z)
                </li>
                <li className={passwordValidation.hasNumber ? "valid" : ""}>
                  At least one number (0-9)
                </li>
                <li
                  className={passwordValidation.hasSpecialChar ? "valid" : ""}
                >
                  At least one special symbol (!@#$%^&*)
                </li>
              </ul>
            </div>
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
          <button type="submit" className="button">
            הרשמה
          </button>
          <p className="message">
            יש לך כבר חשבון?{" "}
            <button onClick={() => setIsSignUp(false)}>כניסה</button>
          </p>
        </form>
      ) : (
        <SigninPage />
      )}
    </>
  );
};

export default SignupPage;
