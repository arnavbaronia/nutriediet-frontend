import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/CreateMotivationPage.css";

const EditMotivationPage = () => {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [postingActive, setPostingActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
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
        alert(error.response?.data?.error || "Error fetching motivation.");
        setLoading(false);
      }
    };

    fetchMotivation();
  }, [id]);

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

      setShowSuccess(true);
      setTimeout(() => navigate("/admin/motivations"), 2000);
    } catch (error) {
      alert(error.response?.data?.error || "Error updating motivation.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="motivation-container">
      {/* Floating success message */}
      {showSuccess && (
        <div className="success-message-container">
          <div className="success-message">
             Motivation updated successfully!
          </div>
        </div>
      )}

      <div className="motivation-box">
        <div className="motivation-headerk">
          <h2>Edit Motivation</h2>
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
            {loading ? "Updating..." : "Update Motivation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMotivationPage;