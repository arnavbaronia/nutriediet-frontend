import React from "react";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import logo from "../assets/Transparent_Logo.png";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Left Section - Logo & About */}
      <div className="footer-left">
        <img src={logo} alt="Indian Nutritionist Logo" className="footer-logo" />
        <p className="footer-description">
          We, at Indian Nutritionist, are dedicated to empowering individuals with the expertise of our experienced nutritionists. 
          Our personalized diet plans and expert nutritional counseling are designed to support you every step of the way. 
          Experience the transformative power of personalized nutrition today.
        </p>
        <p className="footer-founder"><strong>Founder & Head Nutritionist:</strong> Shweta Sharma</p>
        <p className="footer-copyright">© 2024 Indian Nutritionist. All rights reserved.</p>
      </div>

      {/* Middle Section - Services & About */}
      <div className="footer-middle">
        <div className="footer-column">
          <h3 className="footer-heading">Services</h3>
          <ul>
            <li><a href="/weight-loss">Weight Loss Plan</a></li>
            <li><a href="/pcos-management">PCOS/PCOD Management Plan</a></li>
            <li><a href="/thyroid-management">Thyroid Management Plan</a></li>
            <li><a href="/diabetes-management">Diabetes Management Plan</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-heading">About</h3>
          <ul>
            <li><a href="/diet-plans">Diet Plans</a></li>
            <li><a href="/story">Story</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms and Conditions</a></li>
            <li><a href="/refund-policy">Return and Refund Policy</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
      </div>

      {/* Right Section - Social Media */}
      <div className="footer-right">
        <h3 className="footer-heading">Follow Us</h3>
        <div className="footer-social-icons">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaFacebookF />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaYoutube />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;