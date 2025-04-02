import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/SaveAsDietTemplatePage.css";

const SaveAsDietTemplatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { originalName, dietDetails } = location.state || {
    originalName: "",
    dietDetails: "",
  };

  const [formData, setFormData] = useState({ 
    name: originalName, 
    diet: dietDetails 
  });
  const [message, setMessage] = useState({ text: "", type: "" });

  const api = axios.create({
    baseURL: "https://nutriediet-go.onrender.com",
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!formData.name.trim()) {
      setMessage({ text: "Template name is required", type: "error" });
      return;
    }

    if (!formData.diet.trim()) {
      setMessage({ text: "Diet plan is required", type: "error" });
      return;
    }

    try {
      const response = await api.post("/admin/diet_templates/new", {
        name: formData.name,
        diet: formData.diet,
      });

      if (response.data && response.data.success) {
        setMessage({ 
          text: "Diet template saved successfully!", 
          type: "success" 
        });
        setTimeout(() => {
          navigate("/admin/diet_templates");
        }, 1500);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMessage({ 
          text: "A template with this name already exists. Please choose a different name.", 
          type: "error" 
        });
      } else {
        setMessage({ 
          text: "Failed to save diet template. Please try again.", 
          type: "error" 
        });
      }
    }
  };

  return (
    <div className="save-as-diet-template-page">
      <h1 className="page-title1">Save As New Diet Template</h1>

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

        {message.text && (
          <p className={message.type === "success" ? "success-message" : "error-message"}>
            {message.text}
          </p>
        )}
      </Form>
    </div>
  );
};

export default SaveAsDietTemplatePage;