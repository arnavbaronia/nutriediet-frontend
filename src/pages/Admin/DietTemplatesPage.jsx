import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/DietTemplatesPage.css";

const DietTemplatesPage = () => {
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedDietTemplateId, setSelectedDietTemplateId] = useState("");
  const [selectedDietTemplateDetails, setSelectedDietTemplateDetails] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8081",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchDietTemplates = async () => {
    try {
      const response = await api.get("/admin/diet_templates");
      setDietTemplates(response.data.list || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch diet templates. Please try again.");
    }
  };

  const fetchDietTemplateById = async (dietTemplateId) => {
    try {
      const response = await api.get(`/admin/diet_templates/${dietTemplateId}`);
      setSelectedDietTemplateDetails(response.data.template || {});
      setError(null);
    } catch (err) {
      setError("Failed to fetch diet template details. Please try again.");
    }
  };

  const deleteDietTemplate = async (dietTemplateId) => {
    if (!window.confirm("Are you sure you want to delete this diet template?")) return;

    try {
      await api.post(`/admin/diet_templates/${dietTemplateId}/delete`);
      setSelectedDietTemplateDetails(null);
      setSelectedDietTemplateId("");
      fetchDietTemplates();
      setError(null);
    } catch (err) {
      setError("Failed to delete diet template. Please try again.");
    }
  };

  useEffect(() => {
    fetchDietTemplates();
  }, []);

  return (
    <div className="diet-templates-page">
      <div className="top-section">
        <h1 className="page-title">Diet Templates</h1>
        <div className="header-section">
          <Form.Group controlId="templateSelect" className="template-select">
            <Form.Control
              as="select"
              value={selectedDietTemplateId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setSelectedDietTemplateId(selectedId);
                if (selectedId) {
                  fetchDietTemplateById(selectedId);
                } else {
                  setSelectedDietTemplateDetails(null);
                }
              }}
              className="custom-dropdown"
            >
              <option value="">-- Select a Diet Template --</option>
              {dietTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className="action-buttons">
            <Button
              onClick={() => navigate("/admin/diet_templates/new")}
              className="btn-create"
            >
              <FaPlusCircle /> Create
            </Button>
            <Button
              onClick={() => navigate(`/admin/diet_templates/${selectedDietTemplateId}`)}
              disabled={!selectedDietTemplateId}
              className="btn-edit"
            >
              Edit
            </Button>
            <Button
              onClick={() => deleteDietTemplate(selectedDietTemplateId)}
              disabled={!selectedDietTemplateId}
              className="btn-delete"
            >
              <FaTrashAlt /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="template-details">
        {selectedDietTemplateDetails ? (
          <div className="details-grid">
            {Object.entries(selectedDietTemplateDetails).map(([mealName, mealDetails]) => (
              <div key={mealName} className="meal-section">
                <h2 className="meal-name">{mealName}</h2>
                <div className="card-container">
                  <div className="meal-box">
                    <h3>Primary Options</h3>
                    <ul>
                      {(mealDetails.Primary || []).map((item) => (
                        <li key={item.ID}>
                          <strong>{item.Name}</strong> - {item.Quantity}
                          {item.Preparation && ` (${item.Preparation})`}
                          {item.Consumption && ` (${item.Consumption})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="meal-box">
                    <h3>Alternative Options</h3>
                    <ul>
                      {(mealDetails.Alternative || []).map((item) => (
                        <li key={item.ID}>
                          <strong>{item.Name}</strong> - {item.Quantity}
                          {item.Preparation && ` (${item.Preparation})`}
                          {item.Consumption && ` (${item.Consumption})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="info-text">Select a template to view details</p>
        )}
      </div>
    </div>
  );
};

export default DietTemplatesPage;
