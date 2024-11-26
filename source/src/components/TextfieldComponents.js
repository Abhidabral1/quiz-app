// TextfieldComponents.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "../stylesheets/Login.css";

const TextField = ({ type, placeholder, value, onChange, required }) => {
  return (
    <div>
      <input
        className="text-field1"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

const Button = ({ type, label }) => {
  return (
    <button className="btn" type={type}>
      {label}
    </button>
  );
};

const PasswordField = ({
  type,
  placeholder,
  value,
  onChange,
  required,
  showPassword,
  togglePassword,
}) => {
  return (
    <div className="password-field">
      <input
        className="password-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <FontAwesomeIcon
        icon={showPassword ? faEye : faEyeSlash}
        onClick={togglePassword}
        className="password-toggle-icon"
      />
    </div>
  );
};

export { TextField, Button, PasswordField };
