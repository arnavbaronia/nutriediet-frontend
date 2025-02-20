import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import "../../styles/AdminRecipeListPage.css";

const AdminRecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.get("http://localhost:8081/admin/recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRecipes(response.data.list || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch recipes.");
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipeDetails = async (meal_id) => {
    if (!meal_id) {
      console.error("Invalid meal_id provided for fetching recipe details.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");
  
      const response = await axios.get(`http://localhost:8081/admin/recipe/${meal_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.data.recipe) throw new Error("Recipe data is missing");
  
      console.log("Fetched Recipe:", response.data.recipe);
      setSelectedRecipe(response.data.recipe);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to fetch recipe details.");
    }
  };  

  const handleDelete = async () => {
    if (!selectedRecipe || !selectedRecipe.RecipeID) {
      setError("Invalid recipe selected for deletion.");
      return;
    }

    const meal_id = selectedRecipe.RecipeID;
    console.log("Deleting Recipe with Meal ID:", meal_id); 
    console.log("Selected Recipe Object:", selectedRecipe);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      const response = await axios.post(
        `http://localhost:8081/admin/recipe/${meal_id}/delete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Recipe deleted successfully");
        setSelectedRecipe(null);
        fetchRecipes(); 
      } else {
        throw new Error("Failed to delete recipe.");
      }
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
          <button type="button" className="new-recipe-button" onClick={() => navigate("/admin/recipes/new")}>
            + New Recipe
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
              <button onClick={() => navigate(`/admin/recipe/${selectedRecipe.RecipeID}`)}>Edit</button>
              <button className="delete" onClick={handleDelete}>
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
