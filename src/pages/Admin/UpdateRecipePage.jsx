import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import '../../styles/CreateRecipePage.css';

const UpdateRecipePage = () => {
  const { recipe_id } = useParams();
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingRecipe, setFetchingRecipe] = useState(true);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: 'https://nutriediet-go.onrender.com',
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(`/admin/recipes/${recipe_id}`);
        const recipeData = response.data.recipe || response.data;
        
        if (recipeData) {
          setName(recipeData.Name || recipeData.name || "");
          const imageUrl = recipeData.ImageURL || recipeData.image_url;
          if (imageUrl) {
            setCurrentImageUrl(`https://nutriediet-go.onrender.com${imageUrl}`);
          }
        } else {
          throw new Error('Recipe data not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setErrorMessage(
          err.response?.data?.error || 
          err.response?.data?.err || 
          'Failed to fetch recipe details. Please try again.'
        );
      } finally {
        setFetchingRecipe(false);
      }
    };

    fetchRecipe();
  }, [recipe_id]);

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

    if (!name) {
      setErrorMessage("Recipe name is required");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      
      if (file) {
        formData.append("file", file);
      }

      await api.post(`/admin/recipes/${recipe_id}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage("Recipe updated successfully!");
      setTimeout(() => {
        navigate('/admin/recipes');
      }, 1500);
    } catch (err) {
      console.error('Error updating recipe:', err);
      setErrorMessage(
        err.response?.data?.error || 
        err.response?.data?.err || 
        "Failed to update recipe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingRecipe) {
    return (
      <div className="admin-create-recipe">
        <div className="loading-container">
          <p className="loading-text">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-create-recipe">
      <h1><strong>Update Recipe</strong></h1>
      
      {successMessage && (
        <div className="success-message-container11">
          <div className="success-message2">
            <FaCheckCircle style={{ marginRight: '8px' }} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message-container11">
          <div className="error-message2">
            <FaExclamationTriangle style={{ marginRight: '8px' }} />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
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
        
        <div className="form-group">
          <label htmlFor="image">Recipe Image</label>
          {currentImageUrl && !preview && (
            <div className="image-preview-container">
              <p>Current Image:</p>
              <img 
                src={currentImageUrl} 
                alt={name} 
                className="image-preview" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-recipe.jpg';
                }}
              />
            </div>
          )}
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="file-input"
          />
          {preview && (
            <div className="image-preview-container">
              <p>New Image Preview:</p>
              <img src={preview} alt="Preview" className="image-preview" />
            </div>
          )}
        </div>
        
        <div className="button-group">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Recipe'}
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

export default UpdateRecipePage;