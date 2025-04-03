import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/MotivationManagementPage.css";

const MotivationManagementPage = () => {
  const [motivations, setMotivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMotivations();
  }, []);

  const fetchMotivations = async () => {
    try {
      const token = getToken();
      const response = await axios.get(
        "https://nutriediet-go.onrender.com/admin/motivation",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMotivations(response.data.motivation);
      setLoading(false);
      setTogglingId(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch motivations");
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingId(id);
    try {
      const token = getToken();
      const endpoint = currentStatus ? "unpost" : "post";
      await axios.post(
        `https://nutriediet-go.onrender.com/admin/motivation/${id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Optimistic UI update
      setMotivations(prev => prev.map(motivation => 
        motivation.id === id 
          ? { ...motivation, posting_active: !currentStatus } 
          : motivation
      ));
      
      setSuccess(`Motivation ${currentStatus ? "deactivated" : "activated"} successfully`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
      fetchMotivations(); // Revert on error
    } finally {
      setTogglingId(null);
    }
  };

  const handleCreateNew = () => {
    navigate("/admin/motivations/new");
  };

  const filteredMotivations = motivations.filter(motivation => {
    const matchesSearch = motivation.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && motivation.posting_active) ||
      (statusFilter === "inactive" && !motivation.posting_active);
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="motivation-loading">Loading...</div>;
  if (error) return <div className="error-message"><FaTimes /> {error}</div>;

  return (
    <div className="motivation-page-container">
      <div className="motivation-header">
        <h1 className="motivation-title">Motivation Management</h1>
        <button onClick={handleCreateNew} className="motivation-create-btn">
          <FaPlus /> Create New
        </button>
      </div>

      {success && (
        <div className="success-message-container">
          <div className="success-message">
            {success}
          </div>
        </div>
      )}

      <div className="motivation-filters-container">
        <div className="motivation-search-and-filters">
          <div className="motivation-search-container">
            <FaSearch className="motivation-search-icon" />
            <input
              type="text"
              placeholder="Search motivations..."
              className="motivation-search-bar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="motivation-filter-dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      <div className="motivation-list-container">
        {filteredMotivations.length === 0 ? (
          <div className="motivation-empty-state">No motivations found matching your criteria</div>
        ) : (
          <table className="motivation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Toggle Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMotivations.map((motivation) => (
                <tr key={motivation.id} className={!motivation.posting_active ? "motivation-inactive-row" : ""}>
                  <td>{motivation.id}</td>
                  <td className="motivation-message-cell">
                    {motivation.text.length > 100 
                      ? `${motivation.text.substring(0, 100)}...` 
                      : motivation.text}
                  </td>
                  <td>
                    <span className={motivation.posting_active ? "motivation-active-tag" : "motivation-inactive-tag"}>
                      {motivation.posting_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(motivation.created_at).toLocaleDateString()}</td>
                  <td className="motivation-actions">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={motivation.posting_active}
                        onChange={() => handleToggleStatus(motivation.id, motivation.posting_active)}
                        disabled={togglingId === motivation.id}
                      />
                      <span className="toggle-slider">
                        {togglingId === motivation.id && (
                          <span className="toggle-loading"></span>
                        )}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MotivationManagementPage;