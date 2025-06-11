import React, { useState, useEffect } from "react";
import "../../styles/ClientRecipesPage.css";
import NavigationBar from "../../components/NavigationBar";
import { FaMortarPestle } from "react-icons/fa";
import axios from "axios";

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
        const clientID = localStorage.getItem("client_id") || "";

        if (!token || !clientID) {
          setError("Authentication error. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://nutriediet-go.onrender.com/clients/${clientID}/recipe`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.isActive) {
          setError("Your account is inactive. Please contact support.");
          setLoading(false);
          return;
        }

        setRecipes(response.data.recipes || []);
        setFilteredRecipes(response.data.recipes || []);
      } catch (err) {
        console.error("Error fetching recipes:", err);
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

  const getImageSrc = (recipe) => {
    if (recipe?.imageUrl) {
      return `https://nutriediet-go.onrender.com${recipe.imageUrl}`;
    }
    if (recipe?.imageData) {
      return recipe.imageData;
    }
    return "/placeholder-recipe.jpg";
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

              <div className="recipe-image-container">
                <img
                  src={getImageSrc(selectedRecipe)}
                  alt={selectedRecipe.name}
                  className="recipe-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-recipe.jpg";
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRecipeListPage;