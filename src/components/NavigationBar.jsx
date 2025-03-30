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

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className="navigation-bar">
        <Link to="/" className="nav-logo" onClick={handleLinkClick}>
          <img src={logo} alt="Logo" className="nav-logo-img" />
        </Link>
        <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <MenuIcon />
        </div>
        <div className={`nav-buttons ${isMobileMenuOpen ? "show-menu" : ""}`}>
          <Link
            to={`/clients/${client_id}/weight_update`}
            className={`nav-link ${isActive(`/clients/${client_id}/weight_update`)}`}
            onClick={handleLinkClick}
          >
            <MonitorWeightOutlinedIcon className="nav-icon" />
            <span>Weight Update</span>
          </Link>
          <Link
            to={`/clients/${client_id}/diet`}
            className={`nav-link ${isActive(`/clients/${client_id}/diet`)}`}
            onClick={handleLinkClick}
          >
            <ArticleOutlinedIcon className="nav-icon" />
            <span>Diet Plan</span>
          </Link>
          <Link
            to={`/clients/${client_id}/recipe`}
            className={`nav-link ${isActive(`/clients/${client_id}/recipe`)}`}
            onClick={handleLinkClick}
          >
            <MenuBookIcon className="nav-icon" />
            <span>Recipes</span>
          </Link>
          <Link
            to={`/clients/${client_id}/exercise`}
            className={`nav-link ${isActive(`/clients/${client_id}/exercise`)}`}
            onClick={handleLinkClick}
          >
            <FitnessCenterIcon className="nav-icon" />
            <span>Exercise</span>
          </Link>
          <Link
            to={`/clients/${client_id}/my_profile`}
            className={`nav-link ${isActive(`/clients/${client_id}/my_profile`)}`}
            onClick={handleLinkClick}
          >
            <PersonRoundedIcon className="nav-icon" />
            <span>My Profile</span>
          </Link>
          <button className="logout-button nav-link" onClick={() => setShowLogoutModal(true)}>
            <ExitToAppIcon className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay1">
          <div className="modal-content1">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons1">
              <button className="confirm-button1" onClick={handleLogout}>
                Confirm
              </button>
              <button className="cancel-button1" onClick={() => setShowLogoutModal(false)}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;