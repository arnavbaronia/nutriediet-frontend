import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaTrashAlt, FaPlusCircle, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/DietTemplatesPage.css";

const DietTemplatesPage = () => {
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedDietTemplate, setSelectedDietTemplate] = useState(null);
  const [dietDetails, setDietDetails] = useState("");
  const [error, setError] = useState(null);

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
        setDietDetails(response.data.template.replace(/\n/g, "<br />"));
      }
    } catch (err) {
      setDietDetails("Error loading diet details.");
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedDietTemplate(template);
    fetchDietTemplateById(template.ID);
  };

  const handleDelete = async () => {
    if (!selectedDietTemplate) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the diet template: "${selectedDietTemplate.Name}"?`
    );
    if (!confirmDelete) return;
    try {
      await api.post(`/admin/diet_templates/${selectedDietTemplate.ID}/delete`);
      setDietTemplates(dietTemplates.filter((t) => t.ID !== selectedDietTemplate.ID));
      setSelectedDietTemplate(null);
      setDietDetails("");
      alert("Diet template deleted successfully.");
    } catch (err) {
      alert("Failed to delete diet template. Please try again.");
    }
  };

  const handleSaveAs = () => {
    alert("Save As functionality will be implemented soon!");
  };

  return (
    <div className="diet-templates-page">
      <h1 className="page-title">Diet Templates</h1>
      <div className="template-container">
        <div className="template-menu">
          <div className="menu-header">
            <Button onClick={() => navigate("/admin/diet_templates/new")} className="btn-create">
              <FaPlusCircle /> Create New
            </Button>
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
              Edit
            </Button>
            <Button onClick={handleDelete} disabled={!selectedDietTemplate} className="btn-delete">
              <FaTrashAlt /> Delete
            </Button>
          </div>

          <div className="template-details">
            {selectedDietTemplate ? (
              <div className="single-container">
                <h2>{selectedDietTemplate.Name}</h2>
                <div className="diet-details-box" dangerouslySetInnerHTML={{ __html: dietDetails }} />
              </div>
            ) : (
              <p className="info-text">Select a template from the menu to view details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietTemplatesPage;