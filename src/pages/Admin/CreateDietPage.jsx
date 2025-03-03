import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/CreateDietPage.css";

const CreateDietPage = () => {
  const { client_id } = useParams();
  const [dietType, setDietType] = useState(0);
  const [weekNumber, setWeekNumber] = useState(1);
  const [diet, setDiet] = useState("");
  const [error, setError] = useState(null);
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [dietHistoryRegular, setDietHistoryRegular] = useState([]);
  const [dietHistoryDetox, setDietHistoryDetox] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedPastTemplate, setSelectedPastTemplate] = useState("");
  const [pastDiet, setPastDiet] = useState("");

  useEffect(() => {
    fetchDietTemplates();
    fetchDietHistory();
  }, [client_id]);

  const fetchDietTemplates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8081/admin/diet_templates", {
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
      const response = await axios.get(`http://localhost:8081/admin/diet_templates/${dietTemplateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.template) {
        setDietFunction(response.data.template);
      }
    } catch {
      setError("Failed to load diet template details.");
    }
  };

  const fetchDietHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8081/admin/client/${client_id}/diet_history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDietHistoryRegular(response.data.diet_history_regular || []);
      setDietHistoryDetox(response.data.diet_history_detox || []);
    } catch {
      setError("Failed to load diet history.");
    }
  };

  const handleHistorySelect = (dietId, type) => {
    if (!dietId) return;

    const selectedDiet =
      type === 0
        ? dietHistoryRegular.find((d) => d.diet_id === parseInt(dietId))
        : dietHistoryDetox.find((d) => d.diet_id === parseInt(dietId));

    if (selectedDiet) {
      setSelectedHistory(selectedDiet);
      setPastDiet(selectedDiet.diet);
      setDietType(type); 
    }
  };

  const handleEdit = () => {
    if (selectedHistory) {
      console.log("Selected Diet for Edit:", selectedHistory);
      setDiet(selectedHistory.diet);
      setDietType(selectedHistory.diet_type ?? (dietHistoryDetox.includes(selectedHistory) ? 1 : 0));
      setWeekNumber(selectedHistory.week_number);
      setEditMode(true);
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
    const token = localStorage.getItem("token");
    const validDietType = isNaN(dietType) ? 0 : Number(dietType);

    const dietData = {
      diet_id: selectedHistory ? selectedHistory.diet_id : null,
      DietType: validDietType,
      diet: diet,
    };

    console.log("Diet data to be saved/updated:", dietData);

    try {
      if (editMode) {
        await axios.post(`http://localhost:8081/admin/${client_id}/edit_diet`, dietData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Diet updated successfully!");
      } else {
        await axios.post(`http://localhost:8081/admin/${client_id}/diet`, dietData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        alert("Diet saved successfully!");
        setWeekNumber(weekNumber + 1);
      }

      fetchDietHistory();
      setEditMode(false);
    } catch {
      setError("Failed to save diet.");
    }
  };

  return (
    <div className="create-diet-container">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="diet-section">
        {/* Left Side - Create/Edit Diet */}
        <div className="diet-left">
          <h2>{editMode ? "Update" : "Save"}</h2>
          <div className="dropdown-group">
            <Form.Control as="select" value={dietType} onChange={(e) => setDietType(Number(e.target.value))} className="styled-dropdown">
              <option value="0">Regular</option>
              <option value="1">Detox</option>
            </Form.Control>

            <Form.Control as="select" value={selectedTemplate} onChange={handleTemplateSelect} className="styled-dropdown">
              <option value="">Select Template</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>{template.Name}</option>
              ))}
            </Form.Control>
          </div>

          <Form.Control as="textarea" className="diet-input" value={diet} onChange={(e) => setDiet(e.target.value)} />
          <Button className="save-btn" onClick={handleSubmit}>
            {editMode ? "Update" : "Save"}
          </Button>
        </div>

        {/* Right Side - View Past Diets & Templates */}
        <div className="diet-right">
          <h2>View Past Diets & Templates</h2>
          <div className="history-dropdown-group">
            <Form.Control as="select" onChange={(e) => handleHistorySelect(e.target.value, 0)} className="styled-dropdown small-dropdown">
              <option value="">Regular Diet History</option>
              {dietHistoryRegular.map((entry) => (
                <option key={entry.diet_id} value={entry.diet_id}>Week {entry.week_number}</option>
              ))}
            </Form.Control>

            <Form.Control as="select" onChange={(e) => handleHistorySelect(e.target.value, 1)} className="styled-dropdown small-dropdown">
              <option value="">Detox Diet History</option>
              {dietHistoryDetox.map((entry) => (
                <option key={entry.diet_id} value={entry.diet_id}>Week {entry.week_number}</option>
              ))}
            </Form.Control>

            <Form.Control as="select" value={selectedPastTemplate} onChange={handlePastTemplateSelect} className="styled-dropdown small-dropdown">
              <option value="">Select Template</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>{template.Name}</option>
              ))}
            </Form.Control>
          </div>

          <Form.Control as="textarea" className="diet-input diet-input-scrollable" value={pastDiet} readOnly />

          <Button className="edit-butn" onClick={handleEdit} disabled={!selectedHistory}>Edit</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateDietPage;