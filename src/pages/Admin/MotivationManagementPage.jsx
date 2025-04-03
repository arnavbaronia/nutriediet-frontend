import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/MotivationManagementPage.css";

const MotivationManagementPage = () => {
  const [motivations, setMotivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch motivations");
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = getToken();
      const endpoint = currentStatus ? "unpost" : "post";
      await axios.post(
        `https://nutriediet-go.onrender.com/admin/motivation/${id}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMotivations();
      setSuccess(`Motivation ${currentStatus ? "unposted" : "posted"} successfully`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleCreateNew = () => {
    navigate("/admin/motivations/new");
  };

  const handleEdit = (id) => {
    navigate(`/admin/motivations/edit/${id}`);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="motivation-management">
      <div className="header">
        <h2>Motivation Management</h2>
        <button onClick={handleCreateNew} className="create-btn">
          <FaPlus /> Create New
        </button>
      </div>

      {success && (
        <div className="success-message">
          <div className="alert alert-success">
            {success}
          </div>
        </div>
      )}

      <div className="motivation-list">
        {motivations.length === 0 ? (
          <div className="empty-state">No motivations found</div>
        ) : (
          <table className="motivation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {motivations.map((motivation) => (
                <tr key={motivation.id}>
                  <td>{motivation.id}</td>
                  <td className="message-cell">{motivation.text}</td>
                  <td>
                    <span className={`status ${motivation.posting_active ? "active" : "inactive"}`}>
                      {motivation.posting_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{new Date(motivation.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      onClick={() => handleToggleStatus(motivation.id, motivation.posting_active)}
                      className="toggle-btn"
                      title={motivation.posting_active ? "Deactivate" : "Activate"}
                    >
                      {motivation.posting_active ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button
                      onClick={() => handleEdit(motivation.id)}
                      className="edit-btn"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
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