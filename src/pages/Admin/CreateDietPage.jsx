import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import DietHistoryTable from "./DietHistoryTable";
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

      const { diet_history_regular, diet_history_detox } = response.data;
      setDietHistoryRegular(diet_history_regular || []);
      setDietHistoryDetox(diet_history_detox || []);
    } catch (error) {
      console.error("Error fetching diet history:", error);
      setError("Failed to load diet history.");
    }
  };

  const handleHistorySelect = (action, dietId, type) => {
    if (!dietId) {
      setSelectedHistory(null);
      setPastDiet("");
      setEditMode(false);
      return;
    }

    const parsedDietId = parseInt(dietId);
    const selectedDiet =
      type === 0
        ? dietHistoryRegular.find((d) => d.id === parsedDietId)
        : dietHistoryDetox.find((d) => d.id === parsedDietId);

    if (selectedDiet) {
      const dietTypeValue = type;

      setSelectedHistory({
        ...selectedDiet,
        diet_type: dietTypeValue,
      });

      if (action === 'use') {
        setDiet(selectedDiet.diet_string);
        setPastDiet(""); 
        setEditMode(false);
      } else if (action === 'view') {
        setPastDiet(selectedDiet.diet_string); 
        setDiet(""); 
        setEditMode(false);
      } else if (action === 'edit') {
        setDiet(selectedDiet.diet_string);
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
        `http://localhost:8081/admin/${client_id}/delete_diet`,
        dietId,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Diet deleted successfully!");
      fetchDietHistory();
    } catch (error) {
      console.error("Error deleting diet:", error);
      setError("Failed to delete diet.");
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
      id: selectedHistory ? selectedHistory.id : null,
      diet_type: validDietType,
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
      setDiet("");
      setSelectedTemplate("");
    } catch {
      setError("Failed to save diet.");
    }
  };

  return (
    <div className="create-diet-container">
      {error && <Alert variant="danger">{error}</Alert>}
      <DietHistoryTable clientId={client_id} handleDietAction={handleHistorySelect} handleDelete={handleDelete} />
      <div className="diet-section">
        {/* Left Side - Create/Edit Diet */}
        <div className="diet-left">
          <h2>{editMode ? "Update" : "Save"}</h2>
          <div className="dropdown-group">
            <Form.Control
              as="select"
              value={dietType}
              onChange={(e) => setDietType(Number(e.target.value))}
              className="styled-dropdown"
            >
              <option value="0">Regular</option>
              <option value="1">Detox</option>
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

          <Form.Control
            as="textarea"
            className="diet-input"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          />
          <Button className="save-btn" onClick={handleSubmit}>
            {editMode ? "Update" : "Save"}
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

export default CreateDietPage;