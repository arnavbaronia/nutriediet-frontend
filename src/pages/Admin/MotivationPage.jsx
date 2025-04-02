import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { FaSpinner } from "react-icons/fa";
import { Alert } from "react-bootstrap";
import "../../styles/MotivationPage.css";

const MotivationPage = () => {
  const [text, setText] = useState("");
  const [postingActive, setPostingActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", variant: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", variant: "" });

    const token = getToken();
    if (!token) {
      setMessage({ text: "Authentication required", variant: "danger" });
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "https://nutriediet-go.onrender.com/admin/motivations/new",
        { text, posting_active: postingActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ 
        text: "Motivation created successfully!", 
        variant: "success" 
      });
      setText("");
      setPostingActive(true);
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.error || "Error creating motivation.", 
        variant: "danger" 
      });
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
        
        {message.text && (
          <Alert variant={message.variant} className="motivation-alert">
            {message.text}
          </Alert>
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
          
          <button 
            type="submit" 
            disabled={loading} 
            className="submit-button1"
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
        </form>
      </div>
    </div>
  );
};

export default MotivationPage;