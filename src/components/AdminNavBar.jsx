import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavigationBar.css'; 
import logo from '../assets/Nutriediet_Logo_Transparent.png';

const AdminNavBar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Nutriediet Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} className="nav-logo-img" />
        </Link>
      </div>
      <div className="nav-buttons">
        <Link to="/admin/appointments" className={`nav-link ${isActive('/admin/appointments')}`}>Appointments</Link>
        <Link to="/admin/clients" className={`nav-link ${isActive('/admin/clients')}`}>Clients</Link>
        <Link to="/admin/diet-templates" className={`nav-link ${isActive('/admin/diet-templates')}`}>Diet Templates</Link>
        <Link to="/admin/recipes" className={`nav-link ${isActive('/admin/recipes')}`}>Recipes</Link>
        <Link to="/admin/exercises" className={`nav-link ${isActive('/admin/exercises')}`}>Exercises</Link>
        <Link to="/admin/creatediet" className={`nav-link ${isActive('/admin/creatediet')}`}>Create Diet</Link>
        <Link to="/admin/reminders" className={`nav-link ${isActive('/admin/reminders')}`}>Reminders</Link>
        <Link to="/admin/faq-content" className={`nav-link ${isActive('/admin/faq-content')}`}>FAQ Content</Link>
        <Link to="/admin/logout" className="nav-link">Logout</Link>
      </div>
    </nav>
  );
};

export default AdminNavBar;
