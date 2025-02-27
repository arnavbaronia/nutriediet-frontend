import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    user_type: "CLIENT",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("user_type");
    if (userType === "CLIENT") {
      navigate("/clients");
    } else if (userType === "ADMIN") {
      navigate("/admin/dashboard");
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
      const response = await axios.post("http://localhost:8081/login", credentials);
      const { token, refreshToken, user_type, id, email, is_active, client_id } = response.data || {};

      if (user_type === "ADMIN") {
        setError("Admin login is not allowed here.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user_type", user_type);
      localStorage.setItem("clientId", id);
      localStorage.setItem("email", email);
      localStorage.setItem("client_id", client_id);

      if (is_active) {
        console.log("Client is active. Navigating to client dashboard...");
        setTimeout(() => navigate("/clients"), 10);
      } else {
        console.log("Client is inactive. Navigating to account activation page...");
        setTimeout(() => navigate("/account-activation", { state: { token } }), 10);
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError(err.response?.data?.err || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="input-field"
          required
        />
        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;