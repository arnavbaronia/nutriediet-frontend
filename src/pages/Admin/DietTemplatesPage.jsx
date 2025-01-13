import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  // Fetch list of all diet templates
  const fetchDietTemplates = async () => {
    try {
      const response = await api.get("/admin/diet_templates");
      setDietTemplates(response.data.list || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch diet templates. Please try again.");
    }
  };

  // Fetch details of the selected diet template by ID
  const fetchDietTemplateById = async (dietTemplateId) => {
    try {
      const response = await api.get(`/admin/diet_templates/${dietTemplateId}`);
      setSelectedDietTemplateDetails(response.data.template || {});
      setError(null);
    } catch (err) {
      setError("Failed to fetch diet template details. Please try again.");
    }
  };

  // Delete a diet template by ID
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
    <div>
      <h2>Diet Templates</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        {/* Dropdown for selecting diet template */}
        <select
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
        >
          <option value="">-- Select a Diet Template --</option>
          {dietTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
        <button onClick={() => navigate("/admin/diet_templates/new")} style={{ marginLeft: "10px" }}>
          + Create New Template
        </button>
        <button
          onClick={() => navigate(`/admin/diet_templates/${selectedDietTemplateId}`)}
          style={{ marginLeft: "10px" }}
          disabled={!selectedDietTemplateId}
        >
          Edit
        </button>
        <button
          onClick={() => deleteDietTemplate(selectedDietTemplateId)}
          style={{ marginLeft: "10px" }}
          disabled={!selectedDietTemplateId}
        >
          Delete
        </button>
      </div>

      {/* Display details of the selected diet template */}
      {selectedDietTemplateDetails ? (
        <div>
          <h3>Diet Template Details</h3>
          {Object.entries(selectedDietTemplateDetails).map(([mealTiming, mealDetails]) => (
            <div key={mealTiming} style={{ marginBottom: "20px" }}>
              <h4>{mealTiming}</h4>
              <p><strong>Timing:</strong> {mealDetails.Timing || "Not specified"}</p>

              <div>
                <h5>Primary:</h5>
                <ul>
                  {Array.isArray(mealDetails.Primary) &&
                    mealDetails.Primary.map((item) => (
                      <li key={item.ID}>
                        <strong>{item.Name}</strong> - {item.Quantity}
                        <br />
                        <em>Preparation:</em> {item.Preparation}
                        {item.Consumption && (
                          <>
                            <br />
                            <em>Consumption:</em> {item.Consumption}
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              </div>

              <div>
                <h5>Alternative:</h5>
                <ul>
                  {Array.isArray(mealDetails.Alternative) &&
                    mealDetails.Alternative.map((item) => (
                      <li key={item.ID}>
                        <strong>{item.Name}</strong> - {item.Quantity}
                        <br />
                        <em>Preparation:</em> {item.Preparation}
                        {item.Consumption && (
                          <>
                            <br />
                            <em>Consumption:</em> {item.Consumption}
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No diet template selected or available.</p>
      )}
    </div>
  );
};

export default DietTemplatesPage;
