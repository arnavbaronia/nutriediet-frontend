import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/CreateDietTemplatePage.css";
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

const CreateDietTemplatePage = () => {
  const [name, setName] = useState("");
  const [diet, setDiet] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "https://nutriediet-go.onrender.com",
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/diet_templates/new", { name, diet });
      setSuccessMessage("Diet template created successfully!");
      setErrorMessage("");
      setName("");
      setDiet("");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage("Failed to create diet template. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="admin-create-diet">
      <h1><strong>Create a New Diet Template</strong></h1>
      
      {successMessage && (
        <div className="success-message-container">
          <div className="success-message">
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <form onSubmit={handleCreateTemplate}>
        <div>
          <label htmlFor="name">Template Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter template name"
            className="small-input"
            required
          />
        </div>
        <div>
          <label htmlFor="diet">Diet Plan</label>
          <textarea
            id="diet"
            name="diet"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            placeholder="Enter diet details"
            className="large-input"
            required
          ></textarea>
        </div>
        <button type="submit">Save Template</button>
        <button type="button" className="cancel-btn1" onClick={() => navigate("/admin/diet_templates")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateDietTemplatePage;