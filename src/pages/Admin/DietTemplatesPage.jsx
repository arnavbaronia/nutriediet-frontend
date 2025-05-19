import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaTrashAlt, FaPlusCircle, FaSave, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/DietTemplatesPage.css";

const DietTemplatesPage = () => {
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedDietTemplate, setSelectedDietTemplate] = useState(null);
  const [dietDetails, setDietDetails] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "https://nutriediet-go.onrender.com",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchDietTemplates = async () => {
      try {
        const response = await api.get("/admin/diet_templates");
        const sortedTemplates = (response.data.list || []).sort((a, b) =>
          a.Name.localeCompare(b.Name)
        );
        setDietTemplates(sortedTemplates);
        setError(null);
      } catch (err) {
        setError("Failed to fetch diet templates. Please try again.");
      }
    };
    fetchDietTemplates();
  }, []);

  const fetchDietTemplateById = async (dietTemplateId) => {
    if (!dietTemplateId) return;
    try {
      const response = await api.get(`/admin/diet_templates/${dietTemplateId}`);
      if (response.data && response.data.template) {
        setDietDetails(response.data.template);
      }
    } catch (err) {
      setDietDetails("Error loading diet details.");
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedDietTemplate(template);
    fetchDietTemplateById(template.ID);
  };

  const confirmDelete = (templateId) => {
    setTemplateToDelete(templateId);
    setShowDeleteModal(true);
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTemplateToDelete(null);
  };
  
  const executeDelete = async () => {
    if (!templateToDelete) return;
  
    setShowDeleteModal(false);
    setDeleting(true);
    
    try {
      await api.post(`/admin/diet_templates/${templateToDelete}/delete`);
      setDietTemplates(dietTemplates.filter((t) => t.ID !== templateToDelete));
      if (selectedDietTemplate?.ID === templateToDelete) {
        setSelectedDietTemplate(null);
        setDietDetails("");
      }
      setSuccessMessage("Diet template deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete diet template. Please try again.");
    } finally {
      setDeleting(false);
      setTemplateToDelete(null);
    }
  };

  const handleSaveAs = () => {
    if (!selectedDietTemplate) return;
    navigate("/admin/diet_templates/save_as", {
      state: {
        originalName: selectedDietTemplate.Name,
        dietDetails: dietDetails,
      },
    });
  };

  return (
    <div className="diet-templates-page">
      <h1 className="page-title">Diet Templates</h1>
      {successMessage && (
      <div className="success-message-container">
        <div className="success-message12">
          <span>{successMessage}</span>
        </div>
      </div>
    )}
      <div className="template-container">
        <div className="template-menu">
          <div className="menu-header">
            <h3>Diet Templates</h3>
          </div>
          <div className="scrollable-menu">
            {dietTemplates.map((template) => (
              <div
                key={template.ID}
                className={`menu-item ${selectedDietTemplate?.ID === template.ID ? "active" : ""}`}
                onClick={() => handleTemplateSelect(template)}
              >
                {template.Name}
              </div>
            ))}
          </div>
        </div>

        <div className="template-content">
          <div className="action-buttons">
            <Button onClick={() => navigate("/admin/diet_templates/new")} className="btn-create">
              <FaPlusCircle /> Create New
            </Button>
            <Button
              onClick={handleSaveAs}
              disabled={!selectedDietTemplate}
              className="btn-save"
            >
              <FaSave /> Save As
            </Button>
            <Button
              onClick={() => navigate(`/admin/diet_templates/${selectedDietTemplate?.ID}`)}
              disabled={!selectedDietTemplate}
              className="btn-edit"
            >
              <FaEdit /> Edit
            </Button>
            <Button 
              onClick={() => confirmDelete(selectedDietTemplate?.ID)} 
              disabled={!selectedDietTemplate} 
              className="btn-delete"
            >
              <FaTrashAlt /> Delete
            </Button>
          </div>

          <div className="template-details">
            {selectedDietTemplate ? (
              <div className="single-container">
                <h2>{selectedDietTemplate.Name}</h2>
                <div className="diet-details-box">
                  {dietDetails.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ) : (
              <p className="info-text">Select a template from the menu to view details.</p>
            )}
          </div>
          {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete the diet template: "{dietTemplates.find(t => t.ID === templateToDelete)?.Name}"?</p>
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
      </div>
    </div>
  );
};

export default DietTemplatesPage;