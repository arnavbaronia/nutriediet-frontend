import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS, USER_TYPES } from "../utils/constants";
import { validatePasswordStrength, validateEmail } from "../utils/passwordValidator";
import PasswordInput from "./PasswordInput";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: USER_TYPES.CLIENT,
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate email
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0] || "Password does not meet requirements");
      return;
    }

    const payload = {
      ...formData,
      name: `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim(),
    };

    try {
      const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, payload);

      const { token } = response.data || {};

      localStorage.setItem(STORAGE_KEYS.FIRST_NAME, formData.first_name);
      localStorage.setItem(STORAGE_KEYS.LAST_NAME, formData.last_name);

      navigate(`/create_profile/${formData.email}`, { state: { token } });
    } catch (err) {
      setError(err.response?.data?.err || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleSignup} className="signup-form">
        <h1>Sign-Up</h1>
        {error && <p className="error-message">{error}</p>}

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          name="password"
          placeholder="Password"
          showRequirements={true}
          showStrengthMeter={true}
          required={true}
        />
        <div className="login-redirect">
          Already have an account? <span onClick={() => navigate('/login')}>Log in</span>
        </div>
        <button type="submit" className="submit-buttonk">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;