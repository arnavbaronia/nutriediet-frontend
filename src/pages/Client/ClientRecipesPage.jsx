import React, { useState, useEffect } from "react";
import "../../styles/ClientRecipesPage.css";
import NavigationBar from "../../components/NavigationBar";
import axios from "axios";

const ClientRecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const clientEmail = localStorage.getItem("email") || "";
        const clientID = localStorage.getItem("client_id") || "";

        if (!token || !clientID) {
          setError("Authentication error. Please log in.");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Client-Email": clientEmail,
        };

        console.log("Requesting recipes for client ID:", clientID);

        const response = await axios.get(`https://nutriediet-go-production.up.railway.app/clients/${clientID}/recipe`, { headers });

        if (!response.data.isActive) {
          setError("Your account is inactive. Please contact support.");
          return;
        }

        const recipeList = response.data.recipe || [];

        setRecipes(recipeList);
        setFilteredRecipes(recipeList);
      } catch (err) {
        console.error("Error fetching recipes:", err.response?.data || err);
        setError("Failed to fetch recipes. Please try again.");
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
        recipe?.Name?.toLowerCase().includes(query)
      );
      setFilteredRecipes(filtered);
    }
  };

  return (
    <div className="recipe-page">
      <NavigationBar />
      <div className="recipe-content">
        <h1 className="recipe-title">Recipes</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
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
                key={recipe.ID}
                className="recipe-box"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <h3>{recipe?.Name || "Unnamed Recipe"}</h3> 
              </div>
            ))
          ) : (
            <p className="no-recipes">No recipes found</p>
          )}
        </div>

        {selectedRecipe && (
          <div className="recipe-popup-overlay" onClick={() => setSelectedRecipe(null)}>
            <div className="recipe-popup" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={() => setSelectedRecipe(null)}>✖</button>
              <h2>{selectedRecipe?.Name || "Unnamed Recipe"}</h2> 

              <div className="recipe-sections">
                <div className="recipe-section ingredients">
                  <h3>Ingredients</h3>
                  <ul>
                    {selectedRecipe?.Ingredients?.length > 0 ? (
                      selectedRecipe.Ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient || "Unknown ingredient"}</li>
                      ))
                    ) : (
                      <p>No ingredients available</p>
                    )}
                  </ul>
                </div>

                <div className="recipe-section preparation">
                  <h3>Preparation</h3>
                  <ol>
                    {selectedRecipe?.Preparation?.length > 0 ? (
                      selectedRecipe.Preparation.map((step, index) => (
                        <li key={index}>{step || "Unknown step"}</li>
                      ))
                    ) : (
                      <p>No preparation steps available</p>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientRecipeListPage;