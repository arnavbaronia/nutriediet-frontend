import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import api from '../../api/axiosInstance';
import "../../styles/SaveAsDietTemplatePage.css";
import { FaCheckCircle } from 'react-icons/fa';

const SaveAsDietTemplatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { originalName, dietDetails } = location.state || {
    originalName: "",
    dietDetails: "",
  };

  const [formData, setFormData] = useState({ 
    name: originalName, 
    diet: dietDetails 
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Template name is required");
      return;
    }

    if (!formData.diet.trim()) {
      setError("Diet plan is required");
      return;
    }

    try {
      const response = await api.post("/admin/diet_templates/new", {
        name: formData.name,
        diet: formData.diet,
      });

      if (response.data && response.data.success) {
        setSuccess("Diet template saved successfully!");
        setTimeout(() => {
          navigate("/admin/diet_templates");
        }, 1500);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("A template with this name already exists. Please choose a different name.");
      } else {
        setError("Failed to save diet template. Please try again.");
      }
    }
  };

  return (
    <div className="save-as-diet-template-page">
      <h1 className="page-title1">Save As New Diet Template</h1>

      {success && (
        <div className="success-message-container">
          <div className="success-message18">
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label><strong>Template Name</strong></Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="small-input"
          />
          <Form.Text className="text-muted">
            Change the name to create a new template
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="diet">
          <Form.Label><strong>Diet Plan</strong></Form.Label>
          <Form.Control
            as="textarea"
            name="diet"
            value={formData.diet}
            onChange={handleInputChange}
            rows={15}
            required
            className="large-input"
          />
        </Form.Group>

        <div className="button-group2">
          <Button type="submit" className="btn-save1">
            Save As New Template
          </Button>
          <Button 
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/diet_templates")}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SaveAsDietTemplatePage;