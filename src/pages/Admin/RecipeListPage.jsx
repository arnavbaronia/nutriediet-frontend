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

  const handleDelete = async (meal_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      await axios.post(
        `https://nutriediet-go.onrender.com/admin/recipe/${meal_id}/delete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecipes((prev) => prev.filter((recipe) => recipe.RecipeID !== meal_id));
      setSelectedRecipe(null);
      alert("Recipe deleted successfully");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to delete recipe.");
    }
  };

  return (
    <div className="admin-recipes-container">
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
              <button onClick={() => navigate(`/admin/recipe/${selectedRecipe.ID}`)}>Edit</button>
              <button className="delete" onClick={() => handleDelete(selectedRecipe.ID)}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="centered-message">
            <p>Select a recipe to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecipeListPage;