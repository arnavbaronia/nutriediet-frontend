import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import "../../styles/CommonDietPage.css";

const CommonDietPage = () => {
  const [dietType, setDietType] = useState(0);
  const [diet, setDiet] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [pastDiet, setPastDiet] = useState("");
  const [selectedPastTemplate, setSelectedPastTemplate] = useState("");

  useEffect(() => {
    fetchDietTemplates();
  }, []);

  const fetchDietTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://nutriediet-go-production.up.railway.app/admin/diet_templates", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietTemplates(response.data.list || []);
    } catch {
      setError("Failed to load diet templates.");
    }
  };

  const fetchDietTemplateById = async (dietTemplateId, setDietFunction) => {
    if (!dietTemplateId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://nutriediet-go-production.up.railway.app/admin/diet_templates/${dietTemplateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.template) {
        setDietFunction(response.data.template);
      }
    } catch {
      setError("Failed to load diet template details.");
    }
  };

  const handleGroupSelect = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
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

  const handleSubmit = async () => {
    if (!diet || selectedGroups.length === 0) {
      setError("Please fill out all fields and select at least one group.");
      return;
    }

    const token = localStorage.getItem("token");
    const requestData = {
      groups: selectedGroups,
      diet_type: dietType,
      diet: diet,
    };

    try {
      const response = await axios.post("https://nutriediet-go-production.up.railway.app/admin/common_diet", requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setSuccess("Diet saved successfully!");
        setError("");
        setDiet("");
        setSelectedTemplate("");
        setSelectedGroups([]);
      }
    } catch (error) {
      console.error("Error saving diet:", error);
      setError("Failed to save diet.");
    }
  };

  return (
    <div className="create-diet-container">
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="diet-section">
        {/* Left Side - Save Diet */}
        <div className="diet-left">
          <h2>Save Diet</h2>
          <div className="dropdown-group">
            <Form.Control
              as="select"
              value={dietType}
              onChange={(e) => setDietType(Number(e.target.value))}
              className="styled-dropdown"
            >
              <option value="0">Regular</option>
              <option value="1">Detox</option>
              <option value="2">Detox Water</option>
            </Form.Control>

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

          <div className="group-checkboxes">
            {[1, 2, 3, 4, 5, 6].map((groupId) => (
              <Form.Check
                key={groupId}
                type="checkbox"
                id={`group-${groupId}`}
                label={`Group ${groupId}`}
                checked={selectedGroups.includes(groupId)}
                onChange={() => handleGroupSelect(groupId)}
              />
            ))}
          </div>

          <Form.Control
            as="textarea"
            className="diet-input"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          />
          <Button className="save-btn" onClick={handleSubmit}>
            Save
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

          <Form.Control
            as="textarea"
            className="diet-input diet-input-scrollable"
            value={pastDiet}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CommonDietPage;