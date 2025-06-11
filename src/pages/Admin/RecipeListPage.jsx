import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from "react-select";
import { Button } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import '../../styles/AdminRecipeListPage.css';

const AdminRecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState('');
  const [selectedRecipeDetails, setSelectedRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'https://nutriediet-go.onrender.com',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/recipes');
      if (response.data.success && response.data.list) {
        const formattedRecipes = response.data.list.map((recipe) => ({
          id: recipe.RecipeID,
          name: recipe.Name,
        }));
        setRecipes(formattedRecipes);
        setError('');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeById = async (recipeId) => {
    if (!recipeId) return;
    
    setLoading(true);
    try {
      // First get recipe details (JSON response)
      const detailsResponse = await api.get(`/admin/recipes/${recipeId}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      // Then get the image separately
      const imageResponse = await api.get(`/admin/recipes/${recipeId}`, {
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'image/*'
        }
      });
      
      const imageType = imageResponse.headers['content-type'];
      const imageData = imageResponse.data;
      const blob = new Blob([imageData], { type: imageType });
      const imageUrl = URL.createObjectURL(blob);
      
      // Combine recipe details with image
      const recipeData = detailsResponse.data.recipe || detailsResponse.data;
      setSelectedRecipeDetails({
        ...recipeData,
        imageUrl: imageUrl
      });
      
      setError('');
    } catch (err) {
      console.error('Error fetching recipe by ID:', err);
      setError('Failed to fetch recipe details.');
      setSelectedRecipeDetails(null);
    } finally {
      setLoading(false);
    }
  };
  const handleDropdownChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedRecipeId(selectedOption.value);
      fetchRecipeById(selectedOption.value);
    } else {
      setSelectedRecipeId('');
      setSelectedRecipeDetails(null);
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const executeDelete = async () => {
    if (!selectedRecipeId) return;

    setShowDeleteModal(false);
    setDeleting(true);

    try {
      await api.post(`/admin/recipes/${selectedRecipeId}/delete`);
      setSuccess('Recipe deleted successfully!');
      await fetchRecipes();
      setSelectedRecipeDetails(null);
      setSelectedRecipeId('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError(err.response?.data?.error || 'Failed to delete recipe.');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="admin-recipes-container">
      {success && (
        <div className="success-message-container">
          <div className="success-message28">
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="recipe-left-section">
        <h2>Recipes</h2>
        <div className="recipe-controls-container">
          <Select
            options={recipes.map((recipe) => ({
              value: recipe.id,
              label: recipe.name,
            }))}
            value={selectedRecipeId ? { 
              value: selectedRecipeId, 
              label: recipes.find(r => r.id === selectedRecipeId)?.name || '' 
            } : null}
            placeholder="Select a Recipe"
            onChange={handleDropdownChange}
            className="recipe-custom-dropdown"
            isSearchable
            isClearable
          />
          <Button
            className="recipe-btn-create"
            onClick={() => navigate('/admin/recipes/create')}
          >
            <FaPlusCircle /> New Recipe
          </Button>
        </div>
        {error && <p className="recipe-error-text">{error}</p>}
      </div>

      <div className="recipe-right-section">
        {selectedRecipeDetails ? (
          <div className="recipe-card">
            <div className="recipe-image-container">
              {selectedRecipeDetails.imageUrl ? (
                <img
                  src={selectedRecipeDetails.imageUrl}
                  alt={selectedRecipeDetails.Name || selectedRecipeDetails.name}
                  className="recipe-image-thumbnail"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-recipe.jpg';
                  }}
                />
              ) : (
                <div className="recipe-image-placeholder">
                  <span>No Image Available</span>
                </div>
              )}

              <h3 className="selected-recipe-title">
                {selectedRecipeDetails.Name || selectedRecipeDetails.name}
              </h3>
            </div>

            <div className="recipe-action-buttons">
              <Button
                className="recipe-btn-edit"
                onClick={() => navigate(`/admin/recipes/${selectedRecipeId}`)}
              >
                Edit
              </Button>
              <Button
                className="recipe-btn-delete"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="recipe-centered-message">
            <p>Select a recipe to view details.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="recipe-modal-overlay">
          <div className="recipe-delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this recipe?</p>
            <p>Recipe: {selectedRecipeDetails?.Name || selectedRecipeDetails?.name}</p>
            <div className="recipe-modal-buttons">
              <button 
                className="recipe-modal-button recipe-modal-cancel"
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="recipe-modal-button recipe-modal-confirm"
                onClick={executeDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecipeListPage;