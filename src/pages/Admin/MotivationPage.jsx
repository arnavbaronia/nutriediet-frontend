import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/MotivationPage.css";

const MotivationPage = () => {
  const [text, setText] = useState("");
  const [postingActive, setPostingActive] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const token = getToken();
    if (!token) {
      setErrorMessage("Authentication required");
      return;
    }

    try {
      await axios.post(
        "https://nutriediet-go.onrender.com/admin/motivations/new",
        { text, posting_active: postingActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage("Motivation created successfully!");
      setText("");
      setPostingActive(true);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error creating motivation.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="motivation-container">
      <div className="motivation-box">
        <div className="motivation-header">
          <h2>Create New Motivation</h2>
        </div>
        
        {successMessage && (
          <div className="success-message-container">
            <div className="success-message">
              <FaCheckCircle /> {successMessage}
            </div>
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message">
            <FaTimes /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="motivation-form">
          <div className="form-group">
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              required
              className="form-textarea"
              placeholder="Enter motivational message for clients..."
            />
          </div>
          
          <div className="form-checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={postingActive} 
                onChange={() => setPostingActive(!postingActive)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              Posting Active
            </label>
          </div>
          
          <div className="button-group">
            <button 
              type="submit" 
              className="submit-button"
            >
              Create Motivation
            </button>
            <button
              type="button"
              className="cancel-btn4"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MotivationPage;