import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DietHistoryTable from "./DietHistoryTable";
import "../../styles/CreateDietPage.css";

const CreateDietPage = () => {
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
  }, [client_id]);

  const fetchDietTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://nutriediet-go.onrender.com/admin/diet_templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietTemplates(response.data.list || []);
    } catch (err) {
      setError(formatError(err, "Failed to load diet templates."));
    }
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
      setError(formatError(err, "Failed to load diet template details."));
    }
  };

  const fetchDietHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://nutriediet-go.onrender.com/admin/client/${client_id}/diet_history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const regularHistory = response.data.diet_history_regular || [];
      const sortedRegular = regularHistory.sort((a, b) => b.week_number - a.week_number);
  
      setDietHistory(sortedRegular);
    } catch (err) {
      console.error("Error fetching diet history:", err);
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
      await axios.post(
        `https://nutriediet-go.onrender.com/admin/${client_id}/delete_diet`, 
        { diet_id: dietId }, // Wrap in object
        {
          headers: { 
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json" 
          },
        }
      );
      alert("Diet deleted successfully!");
      fetchDietHistory();
    } catch (err) {
      console.error("Error deleting diet:", err);
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
      diet_template_id: selectedTemplate ? parseInt(selectedTemplate) : null,
      ...(editMode && selectedHistory && { diet_id: selectedHistory.id })
    };

    console.log("Submitting data:", requestData);
    
    try {
      const endpoint = editMode 
        ? `https://nutriediet-go.onrender.com/admin/${client_id}/edit_diet`
        : `https://nutriediet-go.onrender.com/admin/${client_id}/diet`;
  
      const response = await axios.post(
        endpoint,
        requestData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
  
      console.log("Response:", response.data); 
  
      alert(editMode ? "Diet updated successfully!" : "Diet saved successfully!");
      
      setEditMode(false);
      setDiet("");
      setSelectedTemplate("");
      setSelectedHistory(null);
      
      fetchDietHistory();
    } catch (err) {
      console.error("Error saving diet:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        setError(formatError(err.response.data, "Failed to save diet."));
      } else {
        setError(formatError(err, "Failed to save diet."));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-diet-container">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {typeof error === 'object' ? JSON.stringify(error) : error}
        </Alert>
      )}
      
      <DietHistoryTable 
        clientId={client_id} 
        dietHistory={dietHistory} 
        handleDietAction={handleHistorySelect} 
        handleDelete={handleDelete}
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
              value={diet || ''}
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
            disabled={submitting || !diet.trim()}
          >
            {submitting ? "Processing..." : (editMode ? "Update" : "Send")}
          </Button>
        </div>

        {/* Right Side - View Past Diets & Templates */}
        <div className="diet-right">
          <h2>View Past Diets & Templates</h2>
          <div className="history-dropdown-group">
            <Form.Control
              as="select"
              value={selectedPastTemplate}
              onChange={handlePastTemplateSelect}
              style={{ width: "800px" }}
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
    </div>
  );
};

export default CreateDietPage;