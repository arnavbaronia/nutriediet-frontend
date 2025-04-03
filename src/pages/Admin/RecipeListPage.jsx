import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { FaPlusCircle } from "react-icons/fa";
import "../../styles/AdminRecipeListPage.css";

const AdminRecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: No token found");

        const response = await axios.get("https://nutriediet-go.onrender.com/admin/recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecipes(response.data.list || []);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch recipes.");
      }
    };

    fetchRecipes();
  }, []);

  const fetchRecipeDetails = async (meal_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.get(`https://nutriediet-go.onrender.com/admin/recipe/${meal_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedRecipe(response.data.recipe);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch recipe details.");
    }
  };

  const confirmDelete = (recipeId) => {
    setRecipeToDelete(recipeId);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRecipeToDelete(null);
  };

  const executeDelete = async () => {
    if (!recipeToDelete) return;

    setShowDeleteModal(false);
    setDeleting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      await axios.post(
        `https://nutriediet-go.onrender.com/admin/recipe/${recipeToDelete}/delete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecipes((prev) => prev.filter((recipe) => recipe.RecipeID !== recipeToDelete));
      if (selectedRecipe?.ID === recipeToDelete) {
        setSelectedRecipe(null);
      }
      setSuccess("Recipe deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to delete recipe.");
    } finally {
      setDeleting(false);
      setRecipeToDelete(null);
    }
  };

  return (
    <div className="admin-recipes-container">
      {success && (
        <div className="success-message-container">
          <div className="success-message">
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="left-section">
        <h2>Recipes</h2>
        <div className="controls-container">
          <Select
            options={recipes.map((recipe) => ({
              value: recipe.RecipeID,
              label: recipe.Name,
            }))}
            placeholder="Select a Recipe"
            onChange={(selectedOption) => fetchRecipeDetails(selectedOption.value)}
            className="custom-dropdown"
            isSearchable
          />
          <button type="button" className="btn-create" onClick={() => navigate("/admin/recipes/new")}>
            <FaPlusCircle /> New Recipe
          </button>
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="right-section">
        {selectedRecipe ? (
          <div>
            <h2>{selectedRecipe.Name}</h2>

            <div className="recipe-details">
              <div className="recipe-section">
                <h3>Ingredients</h3>
                <ul className="bullet-list">
                  {selectedRecipe.Ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div className="recipe-section">
                <h3>Preparation</h3>
                <ol className="bullet-list">
                  {selectedRecipe.Preparation.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={() => navigate(`/admin/recipes/${selectedRecipe.ID}`)}>Edit</button>
              <button 
                className="delete" 
                onClick={() => confirmDelete(selectedRecipe.ID)}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ) : (
          <div className="centered-message">
            <p>Select a recipe to view details.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this recipe?</p>
            <p>Recipe: {recipes.find(r => r.RecipeID === recipeToDelete)?.Name}</p>
            <div className="modal-buttons">
              <button 
                className="modal-button modal-cancel"
                onClick={cancelDelete}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                className="modal-button modal-confirm"
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