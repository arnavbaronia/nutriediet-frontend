import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/EditDietTemplatePage.css";

const EditDietTemplatePage = () => {
  const { diet_template_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", diet: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

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
      setMessage({ text: "Failed to load diet template.", type: "error" });
      setLoading(false);
    }
  };  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      await api.post(`/admin/diet_templates/${diet_template_id}`, {
        ID: parseInt(diet_template_id),
        Name: formData.name,
        Diet: formData.diet,
      });

      setMessage({ text: "Diet template updated successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to update diet template.", type: "error" });
    }
  };

  return (
    <div className="edit-diet-template-page">
      <h1 className="page-title">Edit Diet Template</h1>

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

          <div className="button-group">
            <Button type="submit" className="btn-update">Update</Button>
            <Button variant="secondary" onClick={() => navigate("/admin/diet_templates")} className="btn-cancel">
              Cancel
            </Button>
          </div>

          {message.text && <p className={message.type === "success" ? "success-message" : "error-message"}>{message.text}</p>}
        </Form>
      )}
    </div>
  );
};

export default EditDietTemplatePage;