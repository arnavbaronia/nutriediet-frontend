import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/MotivationPage.css";

const MotivationPage = () => {
  const [text, setText] = useState("");
  const [postingActive, setPostingActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = getToken();
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "https://nutriediet-go.onrender.com/admin/motivations/new",
        { text, posting_active: postingActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Motivation created successfully!");
      setText("");
      setPostingActive(true);
    } catch (error) {
      setError(error.response?.data?.error || "Error creating motivation.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="motivation-container">
      <div className="motivation-box">
        <div className="motivation-header">
          <h2>Create New Motivation</h2>
        </div>
        
        {success && (
          <div className="success-message-container">
            <div className="success-message">
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <FaTimes /> {error}
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
              disabled={loading} 
              className="submit-button"
            >
              {loading ? (
                <>
                  <FaSpinner className="spin-icon" />
                  Creating...
                </>
              ) : (
                "Create Motivation"
              )}
            </button>
            <button
              type="button"
              className="cancel-btn"
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