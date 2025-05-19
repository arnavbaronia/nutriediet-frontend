import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    user_type: "CLIENT",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem("user_type");
    const clientId = localStorage.getItem("client_id");
    if (userType === "CLIENT" && clientId) {
      navigate(`/clients/${clientId}/diet`);
    } else if (userType === "ADMIN") {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const getFriendlyErrorMessage = (error) => {
    if (error.includes("hashedPassword is not the hash of the given password")) {
      return "Incorrect password. Please try again.";
    }
    if (error === "Record Not Found") {
      return "No account found with this email address.";
    }
    if (error === "Can't extract record") {
      return "Error accessing your account. Please try again later.";
    }
    if (error.includes("password does not match")) {
      return "Incorrect password. Please try again.";
    }
    if (error.includes("invalid password")) {
      return "Incorrect password. Please try again.";
    }
    if (error.includes("cannot generate tokens")) {
      return "Login error. Please try again.";
    }
    if (error.includes("cannot update tokens")) {
      return "Login error. Please try again.";
    }
    return error;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post("https://nutriediet-go.onrender.com/login", credentials);
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
      localStorage.setItem("is_active", is_active);
      localStorage.setItem("client_id", client_id);
      localStorage.setItem("user", JSON.stringify(response.data));

      if (is_active) {
        console.log("Client is active. Navigating to diet page...");
        setTimeout(() => navigate(`/clients/${client_id}/diet`), 10);
      } else {
        console.log("Client is inactive. Navigating to account activation page...");
        setTimeout(() => navigate("/account-activation", { state: { token } }), 10);
      }
    } catch (err) {
      console.error("Error during login:", err);
      const backendError = err.response?.data?.err || "Login failed. Please try again.";
      setError(getFriendlyErrorMessage(backendError));
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="login-form">
        <h1>Login</h1>
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

export default Login;