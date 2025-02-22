import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import "../styles/NavigationBar.css";
import logo from "../assets/Nutriediet_Logo_Transparent.png";

const NavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const client_id = localStorage.getItem("client_id");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="navigation-bar">
      <Link to="/" className="nav-logo">
        <img src={logo} alt="Logo" className="nav-logo-img" />
      </Link>
      <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <MenuIcon />
      </div>
      <div className={`nav-buttons ${isMobileMenuOpen ? "show-menu" : ""}`}>
        <Link
          to={`/clients/${client_id}/weight_update`}
          className={`nav-link ${isActive(`/clients/${client_id}/weight_update`)}`}
        >
          <MonitorWeightOutlinedIcon className="nav-icon" />
          <span>Weight Update</span>
        </Link>
        <Link
          to={`/clients/${client_id}/diet`}
          className={`nav-link ${isActive(`/clients/${client_id}/diet`)}`}
        >
          <ArticleOutlinedIcon className="nav-icon" />
          <span>Diet Plan</span>
        </Link>
        <Link
          to={`/clients/recipe`}
          className={`nav-link ${isActive(`/clients/recipe`)}`}
        >
          <MenuBookIcon className="nav-icon" />
          <span>Recipes</span>
        </Link>
        <Link
          to={`/clients/${client_id}/exercise`}
          className={`nav-link ${isActive(`/clients/${client_id}/exercise`)}`}
        >
          <FitnessCenterIcon className="nav-icon" />
          <span>Exercise</span>
        </Link>
        <Link
          to={`/clients/${client_id}/my_profile`}
          className={`nav-link ${isActive(`/clients/${client_id}/my_profile`)}`}
        >
          <PersonRoundedIcon className="nav-icon" />
          <span>My Profile</span>
        </Link>
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
    </div>
  );
};

export default NavigationBar;