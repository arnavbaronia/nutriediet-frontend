import React, { useState } from "react";
import axios from "axios";
import "../styles/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    user_type: "CLIENT",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post("http://localhost:8081/signup", formData);
      setSuccess("Signup successful! Please log in.");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        user_type: "CLIENT",
      });
    } catch (err) {
      setError(err.response?.data?.err || "Signup failed. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="signup-wrapper">
      <form onSubmit={handleSignup} className="signup-form">
        <h1>Sign Up</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />
        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
