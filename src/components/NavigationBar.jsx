import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import '../styles/NavigationBar.css';
import logo from '../assets/Nutriediet_Logo_Transparent.png'; // Import the logo image

const NavigationBar = () => {
  const location = useLocation();

  return (
    <div className="navigation-bar">
      <Link to="/" className="nav-logo">
        <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Link>
      <div className="nav-buttons">
        <Link to="/client/weight-update" className={`nav-link ${location.pathname === '/client/weight-update' ? 'active' : ''}`}>
          <MonitorWeightOutlinedIcon className="nav-icon" />
          <span>Weight Update</span>
        </Link>
        <Link to="/client/diet" className={`nav-link ${location.pathname === '/client/diet' ? 'active' : ''}`}>
          <ArticleOutlinedIcon className="nav-icon" />
          <span>Diet Plan</span>
        </Link>
        <Link to="/client/exercise" className={`nav-link ${location.pathname === '/client/exercise' ? 'active' : ''}`}>
          <FitnessCenterIcon className="nav-icon" />
          <span>Exercise</span>
        </Link>
        <Link to="/client/profile" className={`nav-link ${location.pathname === '/client/profile' ? 'active' : ''}`}>
          <PersonRoundedIcon className="nav-icon" />
          <span>My Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;
