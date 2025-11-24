import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import api from '../../api/axiosInstance';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DietHistoryTable from "./DietHistoryTable";
import "../../styles/CreateDietPage.css";
import logger from '../../utils/logger';

const CreateDietPage = ({ weightUpdateTrigger = 0, onDietSent }) => {
  const { client_id } = useParams();
  const [diet, setDiet] = useState("");
  const [error, setError] = useState(null);
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [dietHistory, setDietHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedPastTemplate, setSelectedPastTemplate] = useState("");
  const [pastDiet, setPastDiet] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
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
    fetchDietHistory();
  }, [client_id, refreshTrigger, weightUpdateTrigger]);

  const fetchDietTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/admin/diet_templates");
      setDietTemplates(response.data.list || []);
    } catch (err) {
      setError(formatError(err, "Failed to load diet templates."));
    }
  };

  const fetchDietTemplateById = async (dietTemplateId, setDietFunction) => {
    if (!dietTemplateId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/diet_templates/${dietTemplateId}`);

      if (response.data?.template) {
        setDietFunction(response.data.template);
      }
    } catch (err) {
      setError(formatError(err, "Failed to load diet template details."));
    }
  };

  const fetchDietHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get(`/admin/client/${client_id}/diet_history`);
  
      const regularHistory = response.data.diet_history_regular || [];
      const sortedRegular = regularHistory.sort((a, b) => b.week_number - a.week_number);
  
      setDietHistory(sortedRegular);
    } catch (err) {
      logger.error("Error fetching diet history:", err);
      setError(formatError(err, "Failed to load diet history."));
    }
  };

  const formatError = (error, defaultMessage) => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.message) return error.message;
    return defaultMessage;
  };

  const handleHistorySelect = (action, dietId) => {
    if (!dietId) {
      setSelectedHistory(null);
      setPastDiet("");
      setEditMode(false);
      return;
    }

    const parsedDietId = parseInt(dietId);
    const selectedDiet = dietHistory.find((d) => d.id === parsedDietId);

    if (selectedDiet) {
      setSelectedHistory(selectedDiet);

      if (action === 'use') {
        setDiet(selectedDiet.diet_string || "");
        setPastDiet(""); 
        setEditMode(false);
      } else if (action === 'view') {
        setPastDiet(selectedDiet.diet_string || ""); 
        setDiet(""); 
        setEditMode(false);
      } else if (action === 'edit') {
        setDiet(selectedDiet.diet_string || "");
        setPastDiet(""); 
        setEditMode(true); 
      }
    }
  };

  const handleDelete = async (dietId) => {
    if (!dietId) {
      setError("No diet selected for deletion.");
      return;
    }
  
    const token = localStorage.getItem("token");
  
    try {
      await api.post(
        `/admin/${client_id}/delete_diet`, 
        dietId,
        {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json" 
          },
        }
      );
      setSuccessMessage("Diet deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      
      setDietHistory(prev => prev.filter(d => d.id !== dietId));
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      logger.error("Error deleting diet:", err);
      setError(formatError(err, "Failed to delete diet."));
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

  const validateForm = () => {
    if (!diet || diet.trim() === "") {
      setError("Diet content cannot be empty");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validateForm()) return;
    
    setSubmitting(true);
    setError(null);
    
    const token = localStorage.getItem("token");
    
    const requestData = {
      diet_type: 1,
      diet: diet,
      ...(selectedTemplate && { diet_template_id: parseInt(selectedTemplate) }),
      ...(editMode && selectedHistory && { diet_id: selectedHistory.id })
    };

    try {
      const endpoint = editMode 
        ? `/admin/${client_id}/edit_diet`
        : `/admin/${client_id}/diet`;

      const response = await api.post(
        endpoint,
        requestData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response.data.message === "Diet information saved successfully") {
        setSuccessMessage(editMode ? "Diet updated successfully!" : "Diet saved successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        
        await fetchDietHistory();

        if (onDietSent && !editMode) {
          onDietSent();
        }
        
        setEditMode(false);
        setDiet("");
        setSelectedTemplate("");
        setSelectedHistory(null);
      } else {
        throw new Error("Unexpected response from server");
      }
      
    } catch (err) {
      logger.error("Error saving diet:", err);
      setError(formatError(err, "Failed to save diet."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setDiet("");
    setSelectedTemplate("");
    setSelectedHistory(null);
  };

  return (
    <div className="create-diet-container">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {typeof error === 'object' ? JSON.stringify(error) : error}
        </Alert>
      )}

      {successMessage && (
        <div className="success-message-container">
          <div className="success-message11">
            {successMessage}
          </div>
        </div>
      )}
      
      <DietHistoryTable
        clientId={client_id}
        dietHistory={dietHistory} 
        handleDietAction={handleHistorySelect} 
        handleDelete={handleDelete}
        weightUpdateTrigger={weightUpdateTrigger} 
      />      
      
      <div className="diet-section">
        {/* Left Side - Create/Edit Diet */}
        <div className="diet-left">
          <h2>{editMode ? "Update" : "Send"}</h2>
          <div className="dropdown-group">
            <Form.Control
              as="select"
              value={selectedTemplate}
              onChange={handleTemplateSelect}
              className="styled-dropdownnn"
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
              value={diet || ''}
              onChange={setDiet}
              modules={quillModules}
              formats={quillFormats}
              className="diet-input rich-editor"
              theme="snow"
            />
          </div>
          <div className="button-group1">
            <Button 
              className="save-btn" 
              onClick={handleSubmit}
              disabled={submitting || !diet.trim()}
            >
              {submitting ? "Processing..." : (editMode ? "Update" : "Send")}
            </Button>
            {editMode && (
              <Button 
                className="cancel-btn"
                onClick={handleCancelEdit}
                disabled={submitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Right Side - View Past Diets & Templates */}
        <div className="diet-right">
          <h2>View Past Diets & Templates</h2>
          <div className="history-dropdown-group">
            <Form.Control
              as="select"
              value={selectedPastTemplate}
              onChange={handlePastTemplateSelect}
              className="styled-dropdownnn small-dropdown"
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
    </div>
  );
};

export default CreateDietPage;