import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    user_type: "CLIENT",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("Login attempt with email:", credentials.email);
    console.log("Login attempt with user_type:", credentials.user_type);
  
    try {
      const response = await axios.post("http://localhost:8081/login", credentials);
  
      const { token, refreshToken, user_type: user_typeFromBackend, id, email } = response.data || {};
      const user_type = user_typeFromBackend; 
  
      console.log("Email returned from backend:", email);
      console.log("user_type returned from backend:", user_type);
  
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user_type", user_type);
      localStorage.setItem("clientId", id);
      localStorage.setItem("email", email);
  
      console.log("Stored email:", localStorage.getItem("email"));
      console.log("Stored user_type:", localStorage.getItem("user_type"));
      console.log("Login successful:", { token, user_type, id });
      console.log("Login response data:", response.data);
  
      setTimeout(() => {
        window.location.href = user_type === "CLIENT" ? "/diet" : "/admin/dashboard";
      }, 13000);
    } catch (err) {
      setError(err.response?.data?.err || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };  

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          User Type:
          <select
            name="user_type"
            value={credentials.user_type}
            onChange={handleChange}
          >
            <option value="CLIENT">Client</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>
        <br />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;