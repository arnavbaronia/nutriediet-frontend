import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/NavigationBar.css";
import logo from "../assets/Nutriediet_Logo_Transparent.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MenuIcon from "@mui/icons-material/Menu";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import BentoIcon from "@mui/icons-material/Bento";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TipsAndUpdatesSharpIcon from '@mui/icons-material/TipsAndUpdatesSharp';

const AdminNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <nav className="navigation-bar">
        <div className="nav-logo">
          <Link to="/">
            <img src={logo} alt="Nutriediet Logo" className="nav-logo-img" />
          </Link>
        </div>
        <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <MenuIcon />
        </div>
        <div className={`nav-buttons ${isMobileMenuOpen ? "show-menu" : ""}`}>
          <Link to="/admin/clients" className={`nav-link ${isActive("/admin/clients")}`}>
            <RecentActorsIcon className="nav-icon" />
            <span>Clients</span>
          </Link>
          <Link to="/admin/common_diet" className={`nav-link ${isActive("/admin/common_diet")}`}>
            <RestaurantIcon className="nav-icon" />
            <span>Common Diets</span>
          </Link>
          <Link to="/admin/diet_templates" className={`nav-link ${isActive("/admin/diet_templates")}`}>
            <BentoIcon className="nav-icon" />
            <span>Diet Templates</span>
          </Link>
          <Link to="/admin/recipes" className={`nav-link ${isActive("/admin/recipes")}`}>
            <MenuBookIcon className="nav-icon" />
            <span>Recipes</span>
          </Link>
          <Link to="/admin/exercises" className={`nav-link ${isActive("/admin/exercises")}`}>
            <FitnessCenterIcon className="nav-icon" />
            <span>Exercises</span>
          </Link>
          <Link to="/admin/motivations" className={`nav-link ${isActive("/admin/motivations")}`}>
            <TipsAndUpdatesSharpIcon className="nav-icon" />
            <span>Motivation</span>
          </Link>
          <button className="logout-button nav-link" onClick={() => setShowLogoutModal(true)}>
            <ExitToAppIcon className="nav-icon" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

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

export default AdminNavBar;