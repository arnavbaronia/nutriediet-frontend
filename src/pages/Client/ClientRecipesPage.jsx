import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Unauthorized: No token found');

        const response = await axios.get('http://localhost:8081/admin/recipes', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecipes(response.data.list || []);
      } catch (err) {
        console.error('Error fetching recipes:', err.response || err);
        setErrorMessage('Failed to fetch recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleRecipeSelect = async (recipeID) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized: No token found');

      const response = await axios.get(`http://localhost:8081/client/recipes/${recipeID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log('Recipe API Response:', response.data); 
      const recipeData = response.data;

      const ingredients = recipeData.ingredients
        ? recipeData.ingredients.split(';').map((ing) => ing.trim())
        : [];
      const preparation = recipeData.preparation
        ? recipeData.preparation.split(';').map((step) => step.trim())
        : [];

      setSelectedRecipe({
        ...recipeData,
        ingredients,
        preparation,
      });
    } catch (err) {
      console.error('Error fetching recipe details:', err.response || err);
      setErrorMessage('Failed to fetch recipe details. Please try again.');
    }
  };

  if (loading) return <p>Loading recipes...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <div>
      <h1>Recipes</h1>
      <div>
        <label htmlFor="recipe-select">Select a Recipe: </label>
        <select
          id="recipe-select"
          onChange={(e) => handleRecipeSelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            -- Select a Recipe --
          </option>
          {recipes.map((recipe) => (
            <option key={recipe.RecipeID} value={recipe.RecipeID}>
              {recipe.Name}
            </option>
          ))}
        </select>
      </div>

      {selectedRecipe && (
        <div>
          <h2>{selectedRecipe.name}</h2>
          <h3>Ingredients</h3>
          {selectedRecipe.ingredients.length > 0 ? (
            <ul>
              {selectedRecipe.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
          ) : (
            <p>No ingredients found.</p>
          )}
          <h3>Preparation Steps</h3>
          {selectedRecipe.preparation.length > 0 ? (
            <ol>
              {selectedRecipe.preparation.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          ) : (
            <p>No preparation steps found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ClientRecipesPage;