import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, PasswordField } from "./TextfieldComponents";
import { useAuth } from "../authentication/AuthContext"; // Importing Auth context
import "../stylesheets/Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      console.log(response.data); // Check the response data here
    
      setMessage(response.data.message);
    
      // **Set the user context and navigate accordingly**
      const userData = {
        email: response.data.email, // Adjust based on actual response
        role: response.data.role, // Ensure this is part of the response
        token: response.data.token,
      };
    
      login(userData); // Set user context
    
      if (response.data.isAdmin) {
        navigate("/admin"); // Redirect to admin page
      } else {
        navigate("/user"); // Redirect to user page
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1 id="h1">Login</h1>

        <TextField
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordField
            type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          togglePassword={togglePassword}
          required
        />
             
        <Button type="submit" label="Login" />
        <div className="titleCss">
          <p id="para">
            Not a Member?{" "}
            <a id="pli" href="/signup">
              Signup
            </a>
          </p>
        </div>
        {message && <p className="alert-message">{message}</p>}
      </form>
    </div>
  );
};
