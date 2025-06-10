import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    user_type: "CLIENT",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: OTP and new password
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleForgotPassword = () => {
    setForgotPasswordModal(true);
    setResetStep(1);
    setResetEmail("");
    setOtp("");
    setNewPassword("");
    setResetError("");
    setResetSuccess("");
  };

  const handleResetEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetError("");
    
    try {
      await axios.post("https://nutriediet-go.onrender.com/auth/forgot-password", {
        email: resetEmail
      });
      setResetStep(2);
      setResetSuccess("OTP sent to your email. Please check your inbox.");
    } catch (err) {
      setResetError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetError("");
    
    try {
      await axios.post("https://nutriediet-go.onrender.com/auth/reset-password", {
        email: resetEmail,
        otp: otp,
        new_password: newPassword
      });
      setResetSuccess("Password reset successfully! You can now login with your new password.");
      setTimeout(() => {
        setForgotPasswordModal(false);
      }, 2000);
    } catch (err) {
      setResetError(err.response?.data?.error || "Failed to reset password. Please check the OTP and try again.");
    } finally {
      setLoading(false);
    }
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    outline: 'none'
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
        <div className="forgot-password-link" onClick={handleForgotPassword}>
          Forgot Password?
        </div>
        <div className="signup-redirect">
          Don't have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
        </div>
        <button type="submit" className="submit-buttonnn">
          Login
        </button>
      </form>

      <Modal
        open={forgotPasswordModal}
        onClose={() => setForgotPasswordModal(false)}
        aria-labelledby="forgot-password-modal"
        aria-describedby="forgot-password-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2" gutterBottom>
            Reset Password
          </Typography>
          
          {resetStep === 1 ? (
            <form onSubmit={handleResetEmailSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              {resetError && <Typography color="error">{resetError}</Typography>}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  onClick={() => setForgotPasswordModal(false)}
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Send OTP"}
                </Button>
              </Box>
            </form>
          ) : (
            <form onSubmit={handlePasswordResetSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="OTP (6 digits)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                inputProps={{ maxLength: 6 }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                helperText="Minimum 6 characters"
              />
              {resetError && <Typography color="error">{resetError}</Typography>}
              {resetSuccess && <Typography color="success">{resetSuccess}</Typography>}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                {/* <Button 
                  onClick={() => setResetStep(1)}
                >
                  Back
                </Button> */}
                <Box>
                  <Button 
                    onClick={() => setForgotPasswordModal(false)}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : "Reset Password"}
                  </Button>
                </Box>
              </Box>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Login;