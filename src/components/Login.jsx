import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    user_type: "CLIENT", 
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => {
      const updatedCredentials = { ...prev, [name]: value };

      if (name === "email" && value === "nutriedietplan@gmail.com") {
        updatedCredentials.user_type = "ADMIN";
      } else if (name === "email") {
        updatedCredentials.user_type = "CLIENT"; 
      }

      return updatedCredentials;
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("http://localhost:8081/login", credentials);

      const { token, refreshToken, user_type: user_typeFromBackend, id, email } = response.data || {};
      const user_type = user_typeFromBackend;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user_type", user_type);
      localStorage.setItem("clientId", id);
      localStorage.setItem("email", email);

      window.location.href = user_type === "CLIENT" ? "/client" : "/admin/dashboard";
    } catch (err) {
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
