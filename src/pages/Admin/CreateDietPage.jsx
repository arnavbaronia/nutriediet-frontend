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
  const [dietHistory, setDietHistory] = useState([]);
  const [selectedHistoryWeek, setSelectedHistoryWeek] = useState("");
  const [pastDiet, setPastDiet] = useState("");
  const [selectedPastTemplate, setSelectedPastTemplate] = useState("");

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
    } catch (error) {
      setError("Failed to load diet templates.");
    }
  };

  const fetchDietHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8081/admin/client/${client_id}/diet_history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDietHistory(response.data.diet_history || []);
    } catch (error) {
      setError("Failed to load diet history.");
    }
  };

  const handleHistorySelect = (week) => {
    setSelectedHistoryWeek(week);
    const selectedDiet = dietHistory.find((d) => d.week_number === parseInt(week));
    setPastDiet(selectedDiet ? selectedDiet.diet : "");
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const dietData = {
      Diet: diet,
      DietType: Number(dietType),
      WeekNumber: Number(weekNumber),
    };

    try {
      await axios.post(`http://localhost:8081/admin/${client_id}/diet`, dietData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Diet saved successfully!");
      setWeekNumber(weekNumber + 1);
      fetchDietHistory();
    } catch (error) {
      setError("Failed to save diet.");
    }
  };

  return (
    <div className="create-diet-container">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="diet-section">
        {/* Left Side - Create Diet */}
        <div className="diet-left">
          <h2>Create Diet</h2>
          <div className="dropdown-group">
            <Form.Control as="select" value={dietType} onChange={(e) => setDietType(Number(e.target.value))} className="styled-dropdown">
              <option value="0">Regular</option>
              <option value="2">Detox</option>
            </Form.Control>
            <Form.Control as="select" value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="styled-dropdown">
              <option value="">-- Select a Template --</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>{template.Name}</option>
              ))}
            </Form.Control>
          </div>
          <Form.Control as="textarea" className="diet-input" value={diet} onChange={(e) => setDiet(e.target.value)} />
          <Button className="save-btn" onClick={handleSubmit}>Save Diet</Button>
        </div>

        {/* Right Side - View Past Diets & Templates */}
        <div className="diet-right">
          <h2>View Past Diets and Templates</h2>
          <div className="dropdown-group">
            <Form.Control as="select" value={selectedHistoryWeek} onChange={(e) => handleHistorySelect(e.target.value)} className="styled-dropdown">
              <option value="">Select a week</option>
              {dietHistory.map((entry) => (
                <option key={entry.week_number} value={entry.week_number}>Week {entry.week_number}</option>
              ))}
            </Form.Control>
            <Form.Control as="select" value={selectedPastTemplate} onChange={(e) => setSelectedPastTemplate(e.target.value)} className="styled-dropdown">
              <option value="">-- Select a Template --</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>{template.Name}</option>
              ))}
            </Form.Control>
          </div>
          <Form.Control as="textarea" className="diet-input diet-input-scrollable" value={pastDiet} readOnly />
          <div className="button-group">
            <Button className="edit-btn">Edit</Button>
            <Button className="delete-btn">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDietPage;
