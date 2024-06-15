import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavigationBar.css'; 
import logo from '../assets/Nutriediet_Logo_Transparent.png';

const AdminNavBar = () => {
  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/"><img src={logo} alt="Nutriediet Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} className="nav-logo-img" /></Link>
      </div>
      <div className="nav-buttons">
        <Link to="/admin/appointments" className="nav-link">Appointments</Link>
        <Link to="/admin/clients" className="nav-link">Clients</Link>
        <Link to="/admin/diet-templates" className="nav-link">Diet Templates</Link>
        <Link to="/admin/recipes" className="nav-link">Recipes</Link>
        <Link to="/admin/exercises" className="nav-link">Exercises</Link>
        <Link to="/admin/motivation" className="nav-link">Motivation</Link>
        <Link to="/admin/reminders" className="nav-link">Reminders</Link>
        <Link to="/admin/faq-content" className="nav-link">FAQ Content</Link>
        <Link to="/admin/logout" className="nav-link">Logout</Link>
      </div>
    </nav>
  );
};

export default AdminNavBar;
