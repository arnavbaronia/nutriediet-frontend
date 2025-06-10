import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...formData,
      name: `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim(),
    };

    try {
      const response = await axios.post("https://nutriediet-go.onrender.com/signup", payload);

      const { token } = response.data || {};

      localStorage.setItem("firstName", formData.first_name);
      localStorage.setItem("lastName", formData.last_name);

      navigate(`/create_profile/${formData.email}`, { state: { token } });
    } catch (err) {
      setError(err.response?.data?.err || "Signup failed. Please try again.");
      console.error("Signup error:", err);
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
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