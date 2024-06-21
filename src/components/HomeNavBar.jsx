import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavigationBar.css'; 
import logo from '../assets/Nutriediet_Logo_Transparent.png';

const HomeNavBar = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/"><img src={logo} alt="Nutriediet Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} className="nav-logo-img" /></Link>
      </div>
      <div className="nav-buttons">
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Signup</Link>
      </div>
    </nav>
  );
};

export default HomeNavBar;
