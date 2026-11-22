import React, { useState, useEffect } from "react";
import "../../styles/ClientRecipesPage.css";
import logger from "../../utils/logger";
import NavigationBar from "../../components/NavigationBar";
import RecipeCard from "../../components/RecipeCard";
import { FaMortarPestle } from "react-icons/fa";
import api from "../../api/axiosInstance";
import { API_ENDPOINTS } from "../../utils/constants";

const ClientRecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const clientID = localStorage.getItem("client_id") || "";

        if (!clientID) {
          setError("Authentication error. Please log in.");
          setLoading(false);
          return;
        }

        const response = await api.get(API_ENDPOINTS.CLIENT_RECIPES(clientID));

        if (!response.data.isActive) {
          setError("Your account is inactive. Please contact support.");
          setLoading(false);
          return;
        }

        const recipeList = response.data.recipes || [];
        setRecipes(recipeList);
        setFilteredRecipes(recipeList);
      } catch (err) {
        logger.error("Error fetching recipes", err);
        setError(
          err.response?.data?.error || "Failed to fetch recipes. Please try again."
        );
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
      return;
    }

    const filtered = recipes.filter((recipe) =>
      recipe?.title?.toLowerCase().includes(query)
    );
    setFilteredRecipes(filtered);
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

        <div className="recipe-card-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id || recipe.slug} recipe={recipe} />
            ))
          ) : (
            <p className="no-recipes">
              {searchTerm ? "No matching recipes found" : "No recipes available"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientRecipeListPage;
