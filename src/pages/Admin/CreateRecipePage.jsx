import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../../styles/CreateRecipePage.css';

const CreateRecipePage = () => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: 'https://nutriediet-go.onrender.com',
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!file || !name) {
      setErrorMessage("Please provide both name and image");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

      const response = await api.post('/admin/recipes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage("Recipe created successfully!");
      setName("");
      setFile(null);
      setPreview("");
      setTimeout(() => {
        setSuccessMessage("");
        navigate('/admin/recipes');
      }, 2000);
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Failed to create recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-recipe">
      <h1><strong>Create a New Recipe</strong></h1>
      
      {successMessage && (
        <div className="success-message-container">
          <div className="success-message">
            <FaCheckCircle style={{ marginRight: '8px' }} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter recipe name"
            className="small-input"
            required
          />
        </div>
        
        <div>
          <label htmlFor="image">Recipe Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            style={{ width: '97%' }}
            accept="image/*"
            className="file-input"
            required
          />
          {preview && (
            <div className="image-preview-container">
              <img src={preview} alt="Preview" className="image-preview" />
            </div>
          )}
        </div>
        
        <div className="button-group">
          <button 
            type="submit" 
            className="admin-create-recipe1"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
          <button 
            type="button" 
            className="cancel-btn9" 
            onClick={() => navigate('/admin/recipes')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipePage;