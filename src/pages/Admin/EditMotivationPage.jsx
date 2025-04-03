import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { FaCheckCircle, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/MotivationForm.css";

const EditMotivationPage = () => {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [postingActive, setPostingActive] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMotivation = async () => {
      try {
        const token = getToken();
        const response = await axios.get(
          `https://nutriediet-go.onrender.com/admin/motivation`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const motivation = response.data.motivation.find(m => m.id === parseInt(id));
        if (motivation) {
          setText(motivation.text);
          setPostingActive(motivation.posting_active);
        }
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "Error fetching motivation.");
        setLoading(false);
      }
    };

    fetchMotivation();
  }, [id]);

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
      if (!postingActive) {
        await axios.post(
          `https://nutriediet-go.onrender.com/admin/motivation/${id}/unpost`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `https://nutriediet-go.onrender.com/admin/motivation/${id}/post`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSuccessMessage("Motivation updated successfully!");
      setTimeout(() => navigate("/admin/motivations"), 2000);
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error updating motivation.");
      console.error("Error:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="motivation-form-container">
      <div className="motivation-form-box">
        <div className="form-header">
          <button onClick={() => navigate("/admin/motivations")} className="back-button">
            <FaArrowLeft /> Back to List
          </button>
          <h2>Edit Motivation</h2>
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
              Update Motivation
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

export default EditMotivationPage;