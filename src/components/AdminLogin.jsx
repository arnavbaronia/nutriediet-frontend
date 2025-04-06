import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    user_type: "ADMIN",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("user_type");
    if (userType === "ADMIN") {
      navigate("/admin/dashboard");
    } else if (userType === "CLIENT") {
      navigate("/clients");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("https://nutriediet-go.onrender.com/login", credentials);
      const { token, refreshToken, user_type, email } = response.data || {};

      if (user_type !== "ADMIN") {
        setError("Only admins can log in here.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user_type", user_type);
      localStorage.setItem("email", email);

      console.log("Admin login successful. Navigating to admin dashboard...");
      setTimeout(() => navigate("/admin/dashboard"), 10);
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.response?.data?.err || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Admin Login</h1>
        {error && <p className="error-message4">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"} 
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="input-field"
            required
          />
          {showPassword ? (
            <VisibilityOffOutlinedIcon
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)} 
            />
          ) : (
            <VisibilityOutlinedIcon
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)} 
            />
          )}
        </div>
        <button type="submit" className="submit-buttonnn">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;