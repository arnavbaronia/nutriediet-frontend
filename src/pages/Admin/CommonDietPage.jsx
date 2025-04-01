import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "../../styles/CommonDietPage.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const CommonDietPage = () => {
  const [dietType, setDietType] = useState(2);
  const [diet, setDiet] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [pastDiet, setPastDiet] = useState("");
  const [selectedPastTemplate, setSelectedPastTemplate] = useState("");
  const [dietHistory, setDietHistory] = useState({
    detox: [],
    detoxWater: []
  });
  const [historyType, setHistoryType] = useState('detox');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dietToDelete, setDietToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const groups = [1, 2, 3, 4, 5, 6];

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };
  
  const quillFormats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet'
  ];

  useEffect(() => {
    fetchDietTemplates();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchDietHistory();
    }
  }, [selectedGroup]);

  const fetchDietTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://nutriediet-go.onrender.com/admin/diet_templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietTemplates(response.data.list || []);
    } catch (err) {
      setError("Failed to load diet templates.");
    }
  };

  const fetchDietHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://nutriediet-go.onrender.com/admin/common_diet/${selectedGroup}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const detoxHistory = (response.data.diet_history_detox_diet || [])
        .sort((a, b) => b.week_number - a.week_number)
        .map(diet => ({
          ...diet,
          week: diet.week_number,
          date: formatDate(diet.date),
          dietString: diet.diet_string,
          templateId: diet.diet_template_id || '-'
        }));
      
      const detoxWaterHistory = (response.data.diet_history_detox_water || [])
        .sort((a, b) => b.week_number - a.week_number)
        .map(diet => ({
          ...diet,
          week: diet.week_number,
          date: formatDate(diet.date),
          dietString: diet.diet_string,
          templateId: diet.diet_template_id || '-'
        }));
      
      setDietHistory({
        detox: detoxHistory,
        detoxWater: detoxWaterHistory
      });
    } catch (err) {
      setError("Failed to load diet history.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const fetchDietTemplateById = async (dietTemplateId, setDietFunction) => {
    if (!dietTemplateId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://nutriediet-go.onrender.com/admin/diet_templates/${dietTemplateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data?.template) {
        setDietFunction(response.data.template);
      }
    } catch (err) {
      setError("Failed to load diet template details.");
    }
  };

  const handleTemplateSelect = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    if (templateId) {
      fetchDietTemplateById(templateId, setDiet);
    } else {
      setDiet("");
    }
  };

  const handlePastTemplateSelect = (e) => {
    const templateId = e.target.value;
    setSelectedPastTemplate(templateId);
    if (templateId) {
      fetchDietTemplateById(templateId, setPastDiet);
    } else {
      setPastDiet("");
    }
  };

  const handleSubmit = async () => {
    if (!diet || !selectedGroup) {
      setError("Please fill out all fields and select a group.");
      return;
    }

    const token = localStorage.getItem("token");
    const requestData = {
      groups: [parseInt(selectedGroup)],
      diet_type: dietType,
      diet: diet,
      diet_template_id: selectedTemplate ? parseInt(selectedTemplate) : null
    };

    try {
      await axios.post(
        "https://nutriediet-go.onrender.com/admin/common_diet", 
        requestData, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(`Diet saved successfully for Group ${selectedGroup}!`);
      setError("");
      setDiet("");
      setSelectedTemplate("");
      fetchDietHistory();
      
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      console.error("Error saving diet:", err);
      setError(err.response?.data?.error || "Failed to save diet.");
    }
  };

  const handleHistoryAction = (action, dietId, type) => {
    const selectedHistory = type === 'detox' 
      ? dietHistory.detox.find(d => d.id === dietId)
      : dietHistory.detoxWater.find(d => d.id === dietId);

    if (selectedHistory) {
      if (action === 'use') {
        setDiet(selectedHistory.dietString);
      } else if (action === 'view') {
        setPastDiet(selectedHistory.dietString);
      }
    }
  };

  const confirmDelete = (dietId) => {
    setDietToDelete(dietId);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDietToDelete(null);
  };

  const executeDelete = async () => {
    if (!dietToDelete) return;

    setShowDeleteModal(false);
    setDeleting(true);
    
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://nutriediet-go.onrender.com/admin/${selectedGroup}/delete_diet`, 
        { diet_id: dietToDelete },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json" 
          },
        }
      );
      
      fetchDietHistory(); 
      setSuccess("Diet deleted successfully!");
    } catch (error) {
      console.error("Error deleting diet:", error);
      setError("Failed to delete diet.");
    } finally {
      setDeleting(false);
      setDietToDelete(null);
    }
  };

  const filteredHistory = historyType === 'detox' ? dietHistory.detox : dietHistory.detoxWater;
  const latestDetoxId = dietHistory.detox.length > 0 ? dietHistory.detox[0].id : null;
  const latestDetoxWaterId = dietHistory.detoxWater.length > 0 ? dietHistory.detoxWater[0].id : null;

  return (
    <div className="create-diet-container">
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>
        {typeof error === 'object' ? JSON.stringify(error) : error}
      </Alert>}
      
      {success && (
        <div className="success-message">
          <div className="message-content">
            <FaCheckCircle className="icon" />
            <span>{success}</span>
          </div>
          <button className="close-btn" onClick={() => setSuccess("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Group Selection Dropdown */}
      <div className="dropdown-group" style={{ marginBottom: '30px' }}>
        <Form.Control
          as="select"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="styled-dropdown"
        >
          <option value="">Select Group</option>
          {groups.map((group) => (
            <option key={group} value={group}>
              Group {group}
            </option>
          ))}
        </Form.Control>
      </div>
      
      {/* History Section */}
      {selectedGroup && (
        <div className="history-section">
          {/* History Type Toggle */}
          <div className="diet-toggle-container">
            <h2 className="diet-type-heading">Select Diet Type</h2>
            <div className="segmented-control">
              <button
                className={historyType === 'detox' ? 'segment-active' : 'segment'}
                onClick={() => setHistoryType('detox')}
              >
                Detox Diet
              </button>
              <button
                className={historyType === 'detoxWater' ? 'segment-active' : 'segment'}
                onClick={() => setHistoryType('detoxWater')}
              >
                Detox Water
              </button>
            </div>
          </div>
          
      {/* History Table */}
      <div className="history-table-container">
        <h3 className="diet-history-heading">
          {historyType === 'detox' ? 'Detox Diet' : 'Detox Water'} History for Group {selectedGroup}
        </h3>

        <table className="weight-history-table">
          <thead>
            <tr>
              <th scope="col">Week</th>
              <th scope="col">Date</th>
              <th scope="col">Diet Template</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((diet) => (
                <tr key={diet.id}>
                  <td>Week {diet.week}</td>
                  <td>{diet.date}</td>
                  <td>{diet.name || '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="action-button action-use"
                        onClick={() => handleHistoryAction('use', diet.id, historyType)}
                      >
                        View
                      </button>
                      <button
                        type="button"
                        className="action-button action-view"
                        onClick={() => handleHistoryAction('view', diet.id, historyType)}
                      >
                        Refer
                      </button>
                      {(historyType === 'detox' && diet.id === latestDetoxId) || 
                        (historyType === 'detoxWater' && diet.id === latestDetoxWaterId) ? (
                        <>
                          <button
                            type="button"
                            className="action-button action-edit"
                            onClick={() => setDiet(diet.dietString)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="action-button action-delete"
                            onClick={() => confirmDelete(diet.id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-data">
                  No {historyType === 'detox' ? 'detox diet' : 'detox water'} history found for Group {selectedGroup}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
      )}

      {/* Send Diet Section */}
      <div className="diet-section">
        {/* Left Side - Send Diet */}
        <div className="diet-left">
          <h2>Send Diet</h2>
          <div className="dropdown-group">
            <Form.Control
              as="select"
              value={dietType}
              onChange={(e) => setDietType(Number(e.target.value))}
              className="styled-dropdown"
            >
              <option value="2">Detox</option>
              <option value="3">Detox Water</option>
            </Form.Control>

            <Form.Control
              as="select"
              value={selectedTemplate}
              onChange={handleTemplateSelect}
              className="styled-dropdown"
            >
              <option value="">Select Template</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>
                  {template.Name}
                </option>
              ))}
            </Form.Control>
          </div>

          <div className="diet-input-container">
            <ReactQuill
              value={diet}
              onChange={setDiet}
              modules={quillModules}
              formats={quillFormats}
              className="diet-input rich-editor"
              theme="snow"
            />
          </div>
          <Button 
            className="save-btn" 
            onClick={handleSubmit}
            disabled={!selectedGroup || !diet.trim()}
          >
            Send
          </Button>
        </div>

        {/* Right Side - View Past Templates */}
        <div className="diet-right">
          <h2>View Templates</h2>
          <div className="history-dropdown-group">
            <Form.Control
              as="select"
              value={selectedPastTemplate}
              onChange={handlePastTemplateSelect}
              className="styled-dropdown small-dropdown"
            >
              <option value="">Select Template</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>
                  {template.Name}
                </option>
              ))}
            </Form.Control>
          </div>

          <div className="diet-input-container view-only">
            <ReactQuill
              value={pastDiet || ''}
              readOnly={true}
              theme="snow"
              modules={{ toolbar: false }}
              className="diet-input diet-input-scrollable"
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this diet record? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="modal-button modal-cancel"
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="modal-button modal-confirm"
                onClick={executeDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonDietPage;