import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/HomeNavBar.css";
import logo from "../assets/Nutriediet_Logo_Transparent.png";

const HomeNavBar = () => {
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Nutriediet Logo" className="nav-logo-img" />
        </Link>
      </div>

      <div className="auth-buttons">
        <Link
          to="/login"
          className={`nav-button login-btn ${isActive("/login")}`}
        >
          Login
        </Link>

        <Link
          to="/signup"
          className={`nav-button signup-btn ${isActive("/signup")}`}
        >
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default HomeNavBar;