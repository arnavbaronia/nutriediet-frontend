import React, { useState, useEffect } from "react";
import "../../styles/ClientRecipesPage.css";
import logger from "../../utils/logger";
import NavigationBar from "../../components/NavigationBar";
import { FaMortarPestle } from "react-icons/fa";
import api from '../../api/axiosInstance';
import { API_BASE_URL } from '../../utils/constants';

// Separate component to prevent re-render loops
const RecipeImage = React.memo(({ recipe }) => {
  const [hasError, setHasError] = useState(false);

  const imageUrl = recipe?.imageUrl || recipe?.image_url || recipe?.Image;

  if (!imageUrl || hasError) {
    return (
      <div className="recipe-image-container">
        <div className="recipe-image-placeholder">
          <FaMortarPestle size={80} />
          <p>{hasError ? 'Failed to load image' : 'No image available'}</p>
        </div>
      </div>
    );
  }

  const fullUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${API_BASE_URL}${imageUrl}`;

  return (
    <div className="recipe-image-container">
      <img
        src={fullUrl}
        alt={recipe?.name || 'Recipe image'}
        className="recipe-image"
        onError={(e) => {
          e.target.onerror = null; // Critical: prevent loop
          setHasError(true);
        }}
      />
    </div>
  );
});

RecipeImage.displayName = 'RecipeImage';

const ClientRecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const clientEmail = localStorage.getItem("email") || "";
        const clientID = localStorage.getItem("client_id") || "";

        if (!token || !clientID) {
          setError("Authentication error. Please log in.");
          setLoading(false);
          return;
        }

        const response = await api.get(`/clients/${clientID}/recipe`
        );

        if (!response.data.isActive) {
          setError("Your account is inactive. Please contact support.");
          setLoading(false);
          return;
        }

        const recipes = response.data.recipes || [];
        setRecipes(recipes);
        setFilteredRecipes(recipes);
      } catch (err) {
        logger.error("Error fetching recipes", err);
        setError(err.response?.data?.error || "Failed to fetch recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    if (!query) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe?.name?.toLowerCase().includes(query)
      );
      setFilteredRecipes(filtered);
    }
  };

  if (loading) {
    return (
      <div className="recipe-page">
        <NavigationBar />
        <div className="recipe-content">
          <h1 className="recipe-title">
            <FaMortarPestle /> Recipes
          </h1>
          <p>Loading recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-page">
      <NavigationBar />
      <div className="recipe-content">
        <h1 className="recipe-title">
          <FaMortarPestle /> Recipes
        </h1>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          className="recipe-search"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="recipe-container">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-box"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <h3>{recipe?.name || "Unnamed Recipe"}</h3>
              </div>
            ))
          ) : (
            <p className="no-recipes">
              {searchTerm ? "No matching recipes found" : "No recipes available"}
            </p>
          )}
        </div>

        {selectedRecipe && (
          <div
            className="recipe-popup-overlay"
            onClick={() => setSelectedRecipe(null)}
          >
            <div className="recipe-popup" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-btn"
                onClick={() => setSelectedRecipe(null)}
              >
                ✖
              </button>
              <h2>{selectedRecipe?.name || "Unnamed Recipe"}</h2>
              
              {/* Recipe image */}
              <RecipeImage recipe={selectedRecipe} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRecipeListPage;