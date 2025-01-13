import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateDietTemplatePage = () => {
  const [newTemplate, setNewTemplate] = useState({ name: "", diet: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8081",
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/diet_templates/new", {
        name: newTemplate.name,
        diet: JSON.parse(newTemplate.diet),
      });
      navigate("/");
    } catch (err) {
      console.error("Error creating diet template:", err.response || err.message);
      setError("Failed to create diet template. Please try again.");
    }
  };

  return (
    <form onSubmit={handleCreateTemplate}>
      <h2>Create New Diet Template</h2>
      <input
        type="text"
        placeholder="Template Name"
        value={newTemplate.name}
        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
        required
      />
      <textarea
        placeholder="Diet JSON"
        value={newTemplate.diet}
        onChange={(e) => setNewTemplate({ ...newTemplate, diet: e.target.value })}
        required
      ></textarea>
      <button type="submit">Save</button>
      <button type="button" onClick={() => navigate("/")}>
        Cancel
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default CreateDietTemplatePage;
