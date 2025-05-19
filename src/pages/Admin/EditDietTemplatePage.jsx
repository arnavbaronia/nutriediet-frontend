import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import "../../styles/EditDietTemplatePage.css";

const EditDietTemplatePage = () => {
  const { diet_template_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", diet: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "https://nutriediet-go.onrender.com",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    fetchDietTemplate();
  }, []);

  const fetchDietTemplate = async () => {
    try {
      const response = await api.get(`/admin/diet_templates/${diet_template_id}`);
      const { name, template } = response.data;
      setFormData({ name: name || "", diet: template || "" }); 
      setLoading(false);
    } catch (error) {
      setError("Failed to load diet template.");
      setLoading(false);
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setError("Template name is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.diet.trim()) {
      setError("Diet plan is required");
      setIsSubmitting(false);
      return;
    }

    try {
      await api.post(`/admin/diet_templates/${diet_template_id}`, {
        ID: parseInt(diet_template_id),
        Name: formData.name,
        Diet: formData.diet,
      });

      setSuccess("Diet template updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("Failed to update diet template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-diet-template-page">
      <h1 className="page-title1">Edit Diet Template</h1>

      {success && (
        <div className="success-message-container">
          <div className="success-message13">
            <span>{success}</span>
          </div>
        </div>
      )}

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
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
              autoFocus
            />
          </Form.Group>

          <Form.Group controlId="diet">
            <Form.Label><strong>Diet Plan</strong></Form.Label>
            <Form.Control
              as="textarea"
              name="diet"
              value={formData.diet}
              onChange={handleInputChange}
              rows="6"
              required
              className="large-input"
            />
          </Form.Group>

          <div className="edit-template-btn-group">
            <Button 
              type="submit" 
              className="edit-template-btn-update"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </Button>
            <Button 
              onClick={() => navigate("/admin/diet_templates")} 
              className="edit-template-btn-cancel"
            >
              Cancel
            </Button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </Form>
      )}
    </div>
  );
};

export default EditDietTemplatePage;