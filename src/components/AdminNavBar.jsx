import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/NavigationBar.css';
import logo from '../assets/Nutriediet_Logo_Transparent.png';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';

const AdminNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-logo">
        <Link to="/">
          <img src={logo} alt="Nutriediet Logo" className="nav-logo-img" />
        </Link>
      </div>
      <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <MenuIcon />
      </div>
      <div className={`nav-buttons ${isMobileMenuOpen ? 'show-menu' : ''}`}>
        <Link to="/admin/appointments" className={`nav-link ${isActive('/admin/appointments')}`}>Appointments</Link>
        <Link to="/admin/clients" className={`nav-link ${isActive('/admin/clients')}`}>Clients</Link>
        <Link to="/admin/diet_templates" className={`nav-link ${isActive('/admin/diet_templates')}`}>Diet Templates</Link>
        <Link to="/admin/recipes" className={`nav-link ${isActive('/admin/recipes')}`}>Recipes</Link>
        <Link to="/admin/exercises" className={`nav-link ${isActive('/admin/exercises')}`}>Exercises</Link>
        <Link to="/admin/creatediet" className={`nav-link ${isActive('/admin/creatediet')}`}>Create Diet</Link>
        <Link to="/admin/reminders" className={`nav-link ${isActive('/admin/reminders')}`}>Reminders</Link>
        <Link to="/admin/faq-content" className={`nav-link ${isActive('/admin/faq-content')}`}>FAQ Content</Link>
        <button className="logout-button nav-link" onClick={() => setShowLogoutModal(true)}>
          <ExitToAppIcon className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleLogout}>
                Confirm
              </button>
              <button className="cancel-button" onClick={() => setShowLogoutModal(false)}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavBar;