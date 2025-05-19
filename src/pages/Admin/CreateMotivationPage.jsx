import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { FaCheck } from "react-icons/fa";
import "../../styles/CreateMotivationPage.css";

const CreateMotivationPage = () => {
  const [text, setText] = useState("");
  const [postingActive, setPostingActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowSuccess(false);

    const token = getToken();
    if (!token) {
      alert("Authentication required");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "https://nutriediet-go.onrender.com/admin/motivations/new",
        { text, posting_active: postingActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowSuccess(true);
      setText("");
      setPostingActive(true);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      alert(error.response?.data?.error || "Error creating motivation.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="motivation-container">
      {/* Floating success message */}
      {showSuccess && (
        <div className="success-message-container">
          <div className="success-message21">
            Motivation created successfully!
          </div>
        </div>
      )}

      <div className="motivation-box">
        <div className="motivation-headerk">
          <h2>Create New Motivation</h2>
        </div>

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
            className="submit-buttonn"
          >
            {loading ? "Creating..." : "Create Motivation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMotivationPage;