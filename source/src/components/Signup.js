// src/Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, PasswordField } from "./TextfieldComponents";
import "../stylesheets/signup.css";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setConfirmShowPassword(!confirmShowPassword);
  

  // Validate Email 
  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  // Validate Password 
  const validatePassword = (password) => {
    return password.length >= 6; //  Password should be at least 6 characters long
  };

  // Handle form validation
  const validateForm = () => {
    const newErrors = {};
           // Validate first and last name length (should be at least 3 characters)
  if (!firstname) {
    newErrors.firstname = "First name is required.";
  } else if (firstname.length < 3) {
    newErrors.firstname = "First name must be at least 3 characters.";
  }

  if (!lastname) {
    newErrors.lastname = "Last name is required.";
  } else if (lastname.length < 3) {
    newErrors.lastname = "Last name must be at least 3 characters.";
  }
    // Validate first and last name
    if (!firstname) newErrors.firstname = "First name is required.";
    if (!lastname) newErrors.lastname = "Last name is required.";

    // Validate email
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate password
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  };

  const handleSignup = async (event) => {
    event.preventDefault();

    // Validate form fields
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If there are any validation errors, prevent submission
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await axios.post("http://localhost:8000/api/signup", {
        firstname,
        lastname,
        email,
        password,
        role,
      });
      setMessage(response.data.message);
      navigate("/"); // Navigate to login or home after successful signup
    } catch (error) {
      console.error("Error during signup:", error.response || error);
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h1 id="h1">Signup</h1>

        <TextField
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstname && <p className="error">{errors.firstname}</p>}

        <TextField
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastname && <p className="error">{errors.lastname}</p>}

        <TextField
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <PasswordField
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          togglePassword={togglePassword}
          required
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <PasswordField
          type={confirmShowPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={confirmShowPassword}
          togglePassword={toggleConfirmPassword}
          required
        />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <Button type="submit" label="Signup" />

        <div className="titleCss">
          <p id="para">
            Already a Member?{" "}
            <a id="pli" href="/">
              Login
            </a>
          </p>
          {message && <p className="alert-message">{message}</p>}
        </div>
      </form>
    </div>
  );
};
