import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { FaCheckCircle, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/MotivationForm.css";

const CreateMotivationPage = () => {
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
      setTimeout(() => navigate("/admin/motivations"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error creating motivation.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="motivation-form-container">
      <div className="motivation-form-box">
        <div className="form-header">
          <button onClick={() => navigate("/admin/motivations")} className="back-button">
            <FaArrowLeft /> Back to List
          </button>
          <h2>Create New Motivation</h2>
        </div>
        
        {successMessage && (
          <div className="success-message">
            <FaCheckCircle /> {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="error-message">
            <FaTimes /> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="motivation-form">
          <div className="form-group">
            <label>Motivation Text</label>
            <textarea 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              required
              className="form-textarea"
              placeholder="Enter motivational message for clients..."
              rows="8"
            />
          </div>
          
          <div className="form-group">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={postingActive} 
                onChange={() => setPostingActive(!postingActive)}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              Posting Active
            </label>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
            >
              Create Motivation
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/admin/motivations")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMotivationPage;