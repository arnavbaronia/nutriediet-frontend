import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import '../styles/NavigationBar.css';
import logo from '../assets/Nutriediet_Logo_Transparent.png';

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user_type");
    localStorage.removeItem("clientId");
    localStorage.removeItem("email");

    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="navigation-bar">
      <Link to="/" className="nav-logo">
        <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Link>
      <div className="nav-buttons">
        <Link to="/client/:client_id/weight-update" className={`nav-link ${location.pathname === '/client/:client_id/weight-update' ? 'active' : ''}`}>
          <MonitorWeightOutlinedIcon className="nav-icon" />
          <span>Weight Update</span>
        </Link>
        <Link to="/client/${clientId}/diet" className={`nav-link ${location.pathname === '/client/:client_id/diet' ? 'active' : ''}`}>
          <ArticleOutlinedIcon className="nav-icon" />
          <span>Diet Plan</span>
        </Link>
        <Link to="/client/recipes" className={`nav-link ${location.pathname === '/client/:client_id/recipes' ? 'active' : ''}`}>
          <MenuBookIcon className="nav-icon" />
          <span>Recipes</span>
        </Link>
        <Link to="/client/:client_id/exercise" className={`nav-link ${location.pathname === '/client/:client_id/exercise' ? 'active' : ''}`}>
          <FitnessCenterIcon className="nav-icon" />
          <span>Exercise</span>
        </Link>
        <Link to="/client/:client_id/profile" className={`nav-link ${location.pathname === '/client/:client_id/profile' ? 'active' : ''}`}>
          <PersonRoundedIcon className="nav-icon" />
          <span>My Profile</span>
        </Link>
        <button className="logout-button nav-link" onClick={() => setShowLogoutModal(true)}>
          <ExitToAppIcon className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
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
    </div>
  );
};

export default NavigationBar;
