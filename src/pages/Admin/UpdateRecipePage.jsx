import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
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
      setFetchingRecipe(true);
      try {
        const response = await api.get(`/admin/recipes/${recipe_id}`);
        const fetchedRecipe = response.data.recipe;
        
        if (fetchedRecipe) {
          setName(fetchedRecipe.name || "");
          if (fetchedRecipe.image_url) {
            setCurrentImageUrl(`https://nutriediet-go.onrender.com${fetchedRecipe.image_url}`);
          }
          setErrorMessage('');
        } else {
          setErrorMessage('Recipe data not found.');
          setTimeout(() => navigate('/admin/recipes'), 3000);
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setErrorMessage(err.response?.data?.error || err.response?.data?.err || 'Failed to fetch recipe details.');
        setTimeout(() => navigate('/admin/recipes'), 3000);
      } finally {
        setFetchingRecipe(false);
      }
    };

    if (recipe_id) {
      fetchRecipe();
    }
  }, [recipe_id, navigate]);

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
      setErrorMessage("Please provide a recipe name");
      setLoading(false);
      return;
    }

    // If no new file is uploaded, but we're changing the name only
    if (!file && currentImageUrl) {
      try {
        // This is a workaround if the backend strictly requires a file
        const dummyFile = new File([new Blob([''], { type: 'text/plain' })], 'dummy.txt', { type: 'text/plain' });
        
        const formData = new FormData();
        formData.append("file", dummyFile);
        formData.append("name", name);
        formData.append("update_name_only", "true"); // This is a hint for the backend

        await api.post(`/admin/recipes/${recipe_id}/update`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setSuccessMessage("Recipe name updated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate('/admin/recipes');
        }, 2000);
      } catch (err) {
        console.error('Error updating recipe name:', err);
        setErrorMessage(err.response?.data?.error || err.response?.data?.err || "Failed to update recipe name. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!file) {
      setErrorMessage("Please provide an image");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);

      const response = await api.post(`/admin/recipes/${recipe_id}/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMessage("Recipe updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate('/admin/recipes');
      }, 2000);
    } catch (err) {
      console.error('Error updating recipe:', err);
      if (err.response?.data?.err && err.response.data.err.includes('no such file or directory')) {
        setSuccessMessage("Recipe updated successfully (previous image was already removed)");
        setTimeout(() => {
          setSuccessMessage("");
          navigate('/admin/recipes');
        }, 2000);
      } else {
        setErrorMessage(err.response?.data?.error || err.response?.data?.err || "Failed to update recipe. Please try again.");
      }
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
            style={{ width: '97%' }}
            accept="image/*"
            className="file-input"
          />
          {preview && (
            <div className="image-preview-container">
              <p>New Image:</p>
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
            className="btn-cancel" 
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