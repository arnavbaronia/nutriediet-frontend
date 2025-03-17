import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/HomeNavBar.css";
import logo from "../assets/Nutriediet_Logo_Transparent.png";
import { FiMenu } from "react-icons/fi";

const HomeNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/" onClick={handleLinkClick}>
          <img src={logo} alt="Nutriediet Logo" className="nav-logo-img" />
        </Link>
      </div>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FiMenu />
      </div>
      <div className={`nav-buttons ${menuOpen ? "show-menu" : ""}`}>
        <Link to="/" className={`nav-link ${isActive("/")}`} onClick={handleLinkClick}>
          Home
        </Link>
        <Link to="/about" className={`nav-link ${isActive("/about")}`} onClick={handleLinkClick}>
          About
        </Link>
        <Link to="/services" className={`nav-link ${isActive("/services")}`} onClick={handleLinkClick}>
          Services
        </Link>
        <Link to="/testimonials" className={`nav-link ${isActive("/testimonials")}`} onClick={handleLinkClick}>
          Testimonials
        </Link>
        <div className="auth-buttons">
          <Link to="/login" className={`nav-button login-btn ${isActive("/login")}`} onClick={handleLinkClick}>
            Login
          </Link>
          <Link to="/signup" className={`nav-button signup-btn ${isActive("/signup")}`} onClick={handleLinkClick}>
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavBar;