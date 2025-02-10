import React, { useState, useEffect } from "react";
import "../../styles/ClientRecipesPage.css";
import NavigationBar from "../../components/NavigationBar";

const dummyRecipes = [
  {
    RecipeID: 1,
    Name: "Grilled Chicken Salad",
    Ingredients: ["Chicken Breast", "Lettuce", "Tomatoes", "Cucumber", "Olive Oil"],
    Preparation: [
      "Grill the chicken breast.",
      "Chop vegetables and mix in a bowl.",
      "Drizzle olive oil and toss well.",
    ],
  },
  {
    RecipeID: 2,
    Name: "Avocado Toast",
    Ingredients: ["Whole grain bread", "Avocado", "Salt", "Lemon Juice"],
    Preparation: [
      "Toast the bread.",
      "Mash avocado and mix with lemon juice & salt.",
      "Spread on toast and serve.",
    ],
  },
  {
    RecipeID: 3,
    Name: "Banana Smoothie",
    Ingredients: ["Banana", "Milk", "Honey", "Ice Cubes"],
    Preparation: [
      "Blend all ingredients until smooth.",
      "Pour into a glass and serve chilled.",
    ],
  },
  {
    RecipeID: 4,
    Name: "Oatmeal Bowl",
    Ingredients: ["Oats", "Milk", "Honey", "Fruits (Banana, Berries)"],
    Preparation: [
      "Cook oats with milk.",
      "Add honey and mix well.",
      "Top with fruits and serve warm.",
    ],
  },
  {
    RecipeID: 5,
    Name: "Quinoa Stir-Fry",
    Ingredients: ["Quinoa", "Bell Peppers", "Carrots", "Soy Sauce", "Tofu"],
    Preparation: [
      "Cook quinoa as per instructions.",
      "Sauté vegetables and tofu with soy sauce.",
      "Mix with cooked quinoa and serve.",
    ],
  },
  {
    RecipeID: 6,
    Name: "Greek Yogurt Parfait",
    Ingredients: ["Greek Yogurt", "Granola", "Honey", "Strawberries"],
    Preparation: [
      "Layer Greek yogurt, granola, and honey in a bowl.",
      "Top with sliced strawberries.",
      "Serve immediately.",
    ],
  },
  {
    RecipeID: 7,
    Name: "Lentil Soup",
    Ingredients: ["Lentils", "Carrots", "Onion", "Garlic", "Vegetable Broth", "Spices"],
    Preparation: [
      "Sauté onions, garlic, and carrots in a pot.",
      "Add lentils and vegetable broth.",
      "Simmer until lentils are soft and serve warm.",
    ],
  },
  {
    RecipeID: 8,
    Name: "Peanut Butter Bites",
    Ingredients: ["Oats", "Peanut Butter", "Honey", "Chia Seeds", "Dark Chocolate Chips"],
    Preparation: [
      "Mix all ingredients in a bowl.",
      "Roll into small bite-sized balls.",
      "Refrigerate for 30 minutes and enjoy.",
    ],
  },
];

const ClientRecipeListPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setRecipes(dummyRecipes);
    setFilteredRecipes(dummyRecipes);
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    if (!query) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.Name.toLowerCase().includes(query)
      );
      setFilteredRecipes(filtered);
    }
  };

  return (
    <div className="recipe-page">
      <NavigationBar />

      <div className="recipe-content">
        <h1 className="recipe-title">Recipes</h1>
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
                key={recipe.RecipeID}
                className="recipe-box"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <h3>{recipe.Name}</h3>
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
              <h2>{selectedRecipe.Name}</h2>

              <div className="recipe-sections">
                <div className="recipe-section ingredients">
                  <h3>Ingredients</h3>
                  <ul>
                    {selectedRecipe.Ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="recipe-section preparation">
                  <h3>Preparation</h3>
                  <ol>
                    {selectedRecipe.Preparation.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
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
