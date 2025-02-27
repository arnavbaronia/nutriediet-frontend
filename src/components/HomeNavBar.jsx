import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/HomeNavBar.css";
import logo from "../assets/Nutriediet_Logo_Transparent.png";
import { FiMenu } from "react-icons/fi";

const HomeNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Nutriediet Logo" className="nav-logo-img" />
        </Link>
      </div>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FiMenu />
      </div>
      <div className={`nav-buttons ${menuOpen ? "show-menu" : ""}`}>
        <Link to="/" className={`nav-link ${isActive("/")}`}>Home</Link>
        <Link to="/about" className={`nav-link ${isActive("/about")}`}>About</Link>
        <Link to="/services" className={`nav-link ${isActive("/services")}`}>Services</Link>
        <Link to="/testimonials" className={`nav-link ${isActive("/testimonials")}`}>Testimonials</Link>
        <div className="auth-buttons">
          <Link to="/login" className={`nav-button login-btn ${isActive("/login")}`}>Login</Link>
          <Link to="/signup" className={`nav-button signup-btn ${isActive("/signup")}`}>Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavBar;