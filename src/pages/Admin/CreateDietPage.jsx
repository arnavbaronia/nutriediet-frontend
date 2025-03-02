import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
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
  const [selectedHistoryWeekRegular, setSelectedHistoryWeekRegular] = useState("");
  const [selectedHistoryWeekDetox, setSelectedHistoryWeekDetox] = useState("");
  const [pastDietRegular, setPastDietRegular] = useState("");
  const [pastDietDetox, setPastDietDetox] = useState("");
  const [selectedPastTemplate, setSelectedPastTemplate] = useState("");
  const navigate = useNavigate();

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
    } catch (error) {
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
    } catch (error) {
      setError("Failed to load diet history.");
    }
  };

  const handleHistorySelect = (week, setWeekState, setDietState, dietHistory, resetOtherDietState) => {
    setWeekState(week);    
    const selectedDiet = dietHistory.find((d) => d.week_number === parseInt(week));
    setDietState(selectedDiet ? selectedDiet.diet : "");
    resetOtherDietState(""); 
  };

  const handleDietTypeChange = (e) => {
    setDietType(Number(e.target.value));
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
      fetchDietTemplateById(templateId, setPastDietRegular);
    } else {
      setPastDietRegular("");
    }
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
            <Form.Control as="select" value={dietType} onChange={handleDietTypeChange} className="styled-dropdown">
              <option value="0">Regular</option>
              <option value="1">Detox</option>
            </Form.Control>
            <Form.Control as="select" value={selectedTemplate} onChange={handleTemplateSelect} className="styled-dropdown">
              <option value="">-- Template --</option>
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

          {/* Regular Diet History, Detox Diet History, and Template Select in One Row */}
          <div className="history-dropdown-group">
            <Form.Control as="select" value={selectedHistoryWeekRegular} onChange={(e) => handleHistorySelect(e.target.value, setSelectedHistoryWeekRegular, setPastDietRegular, dietHistoryRegular, setPastDietDetox)} className="styled-dropdown">
              <option value="">Regular Diet History</option>
              {dietHistoryRegular.map((entry) => (
                <option key={entry.week_number} value={entry.week_number}>Week {entry.week_number}</option>
              ))}
            </Form.Control>

            <Form.Control as="select" value={selectedHistoryWeekDetox} onChange={(e) => handleHistorySelect(e.target.value, setSelectedHistoryWeekDetox, setPastDietDetox, dietHistoryDetox, setPastDietRegular )} className="styled-dropdown">
              <option value="">Detox Diet History</option>
              {dietHistoryDetox.map((entry) => (
                <option key={entry.week_number} value={entry.week_number}>Week {entry.week_number}</option>
              ))}
            </Form.Control>

            <Form.Control as="select" value={selectedPastTemplate} onChange={handlePastTemplateSelect} className="styled-dropdown template-dropdown">
              <option value="">-- Template --</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>{template.Name}</option>
              ))}
            </Form.Control>
          </div>

          <Form.Control as="textarea" className="diet-input diet-input-scrollable" value={pastDietRegular || pastDietDetox} readOnly />
          
          <div className="button-group">
            <Button className="edit-btn">Edit</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDietPage;

/*
import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
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
  const [selectedHistoryWeekRegular, setSelectedHistoryWeekRegular] = useState("");
  const [selectedHistoryWeekDetox, setSelectedHistoryWeekDetox] = useState("");
  const [pastDietRegular, setPastDietRegular] = useState("");
  const [pastDietDetox, setPastDietDetox] = useState("");
  const [selectedPastTemplate, setSelectedPastTemplate] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [selectedDietId, setSelectedDietId] = useState(null);
  const navigate = useNavigate();

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

      setDietHistoryRegular(response.data.diet_history_regular || []);
      setDietHistoryDetox(response.data.diet_history_detox || []);
    } catch (error) {
      setError("Failed to load diet history.");
    }
  };

  const handleHistorySelect = (week, setWeekState, setDietState, dietHistory, resetOtherDietState) => {
    setWeekState(week);
    const selectedDiet = dietHistory.find((d) => d.week_number === parseInt(week));

    if (selectedDiet) {
      setDietState(selectedDiet.diet);
      setSelectedDietId(selectedDiet.diet_id);
      setEditMode(true);
    } else {
      setDietState("");
      setSelectedDietId(null);
      setEditMode(false);
    }
    resetOtherDietState("");
  };

  const fetchDietTemplateById = async (templateId, setDietState) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8081/admin/diet_templates/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && response.data.template) {
        setDietState(response.data.template);
      } else {
        setDietState("");
      }
    } catch (error) {
      setError("Failed to load diet template.");
    }
  };  
  
  const handleDietTypeChange = (e) => {
    setDietType(Number(e.target.value));
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
      fetchDietTemplateById(templateId, setPastDietRegular);
    } else {
      setPastDietRegular("");
    }
  };  

  const handleEdit = () => {
    if (pastDietRegular) {
      setDiet(pastDietRegular);
      setDietType(0);
      setWeekNumber(selectedHistoryWeekRegular);
    } else if (pastDietDetox) {
      setDiet(pastDietDetox);
      setDietType(1);
      setWeekNumber(selectedHistoryWeekDetox);
    }
    setEditMode(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (editMode && selectedDietId) {
      try {
        await axios.post(
          `http://localhost:8081/admin/${client_id}/edit_diet`,
          {
            DietID: selectedDietId,
            Diet: diet,
            DietType: Number(dietType),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        alert("Diet updated successfully!");
        fetchDietHistory();
        setEditMode(false);
        setSelectedDietId(null);
      } catch (error) {
        setError("Failed to update diet.");
      }
    } else {
      try {
        await axios.post(
          `http://localhost:8081/admin/${client_id}/diet`,
          {
            Diet: diet,
            DietType: Number(dietType),
            WeekNumber: Number(weekNumber),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        alert("Diet saved successfully!");
        setWeekNumber(weekNumber + 1);
        fetchDietHistory();
      } catch (error) {
        setError("Failed to save diet.");
      }
    }
  };

  return (
    <div className="create-diet-container">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="diet-section">
        <div className="diet-left">
          <h2>Create Diet</h2>
          <div className="dropdown-group">
            <Form.Control as="select" value={dietType} onChange={handleDietTypeChange} className="styled-dropdown">
              <option value="0">Regular</option>
              <option value="1">Detox</option>
            </Form.Control>
            <Form.Control as="select" value={selectedTemplate} onChange={handleTemplateSelect} className="styled-dropdown">
              <option value="">-- Select a Template --</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>{template.Name}</option>
              ))}
            </Form.Control>
          </div>
          <Form.Control as="textarea" className="diet-input" value={diet} onChange={(e) => setDiet(e.target.value)} />
          <Button className="save-btn" onClick={handleSave}>{editMode ? "Update Diet" : "Save Diet"}</Button>
        </div>

        <div className="diet-right">
          <h2>View Past Diets and Templates</h2>
          <div className="history-dropdown-group">
            <Form.Control as="select" value={selectedHistoryWeekRegular} onChange={(e) => handleHistorySelect(e.target.value, setSelectedHistoryWeekRegular, setPastDietRegular, dietHistoryRegular, setPastDietDetox)} className="styled-dropdown">
              <option value="">Regular Diet History</option>
              {dietHistoryRegular.map((entry) => (
                <option key={entry.week_number} value={entry.week_number}>Week {entry.week_number}</option>
              ))}
            </Form.Control>

            <Form.Control as="select" value={selectedHistoryWeekDetox} onChange={(e) => handleHistorySelect(e.target.value, setSelectedHistoryWeekDetox, setPastDietDetox, dietHistoryDetox, setPastDietRegular)} className="styled-dropdown">
              <option value="">Detox Diet History</option>
              {dietHistoryDetox.map((entry) => (
                <option key={entry.week_number} value={entry.week_number}>Week {entry.week_number}</option>
              ))}
            </Form.Control>
          </div>

          <Button className="edit-btn" onClick={handleEdit} disabled={!editMode}>Edit</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateDietPage;
*/