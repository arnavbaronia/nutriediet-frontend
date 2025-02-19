import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/EditDietTemplatePage.css";

const EditDietTemplatePage = () => {
  const { diet_template_id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    diet: "",
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8081",
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchDietTemplate = async () => {
      try {
        const response = await api.get(`/admin/diet_templates/${diet_template_id}`);
        const { Name, DietString } = response.data;
        setFormData({ name: Name, diet: DietString || "" });
        setLoading(false);
      } catch (err) {
        setErrorMessage("Failed to load diet template.");
        setLoading(false);
      }
    };

    fetchDietTemplate();
  }, [diet_template_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload = {
        ID: parseInt(diet_template_id),
        Name: formData.name,
        Diet: formData.diet,
      };

      await api.put(`/admin/diet_templates/${diet_template_id}`, payload);
      setSuccessMessage("Diet template updated successfully!");
    } catch (err) {
      setErrorMessage("Failed to update diet template. Please try again.");
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
              placeholder="Enter diet template name"
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
              placeholder="Enter diet details"
              required
              className="large-input"
            />
          </Form.Group>

          <div className="button-group">
            <Button type="submit" className="btn-update">
              Update
            </Button>
            <Button variant="secondary" onClick={() => navigate("/admin/diet_templates")} className="btn-cancel">
              Cancel
            </Button>
          </div>

          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </Form>
      )}
    </div>
  );
};

export default EditDietTemplatePage;
