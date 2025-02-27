import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/HomeNavBar.css"; 
import logo from "../assets/Nutriediet_Logo_Transparent.png";
import { FiMenu } from "react-icons/fi";

const HomeNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/"><img src={logo} alt="Nutriediet Logo" className="nav-logo-img" /></Link>
      </div>
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        <FiMenu />
      </div>
      <div className={`nav-buttons ${menuOpen ? "show-menu" : ""}`}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/about" className="nav-link">About</Link>
        <Link to="/services" className="nav-link">Services</Link>
        <Link to="/testimonials" className="nav-link">Testimonials</Link>
        <div className="auth-buttons">
          <Link to="/login" className="nav-button login-btn">Login</Link>
          <Link to="/signup" className="nav-button signup-btn">Signup</Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavBar;