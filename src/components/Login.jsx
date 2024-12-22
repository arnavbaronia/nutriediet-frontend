import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    userType: "CLIENT",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post("http://localhost:8081/login", credentials);
      const { token, refreshToken, userType, id, email } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userType", userType);
      localStorage.setItem("clientId", id);
      localStorage.setItem("email", email);
      console.log("Login successful:", { token, userType, id });
      console.log("Login response data:", response.data);
      setTimeout(() => {
        window.location.href = userType === "CLIENT" ? "/diet" : "/dashboard";
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
            name="userType"
            value={credentials.userType}
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
