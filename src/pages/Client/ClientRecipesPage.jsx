import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientRecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Unauthorized: No token found');

                const response = await axios.get('http://localhost:8081/clients/recipes', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.recipes && Array.isArray(response.data.recipes)) {
                    setRecipes(response.data.recipes);
                } else {
                    throw new Error('Invalid API response: Expected an array of recipes.');
                }
            } catch (err) {
                setError(err.response?.data?.error || err.message || 'Failed to fetch recipes.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const fetchRecipeDetails = async (mealID) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Unauthorized: No token found');

            // Corrected URL: Use template literals for dynamic mealID
            const response = await axios.get(`http://localhost:8081/clients/${mealID}/recipe`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.recipe) {
                setSelectedRecipe(response.data.recipe);
            } else {
                throw new Error('Recipe details not found.');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to fetch recipe details.');
        }
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    if (loading) return <p>Loading recipes...</p>;

  return (
    <div style={{ fontFamily: 'Rubik, sans-serif', padding: '20px', width: '90vw', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333', fontSize: '2rem', fontWeight: 'bold' }}>Client Recipe List</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ textAlign: 'center', margin: '20px 0', position: 'relative' }}>
        <button
          type="button"
          onClick={toggleDropdown}
          style={{
            padding: '12px 24px',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '200px',
            margin: '0 auto',
          }}
        >
          Select a Recipe
          <span style={{ marginLeft: '8px', fontSize: '16px' }}>▼</span>
        </button>
      </div>

      {dropdownVisible && (
        <ul
          style={{
            position: 'absolute',
            background: '#f8f9fa',
            border: '1px solid #ccc',
            borderRadius: '12px',
            listStyle: 'none',
            padding: '10px 0',
            margin: '5px 0',
            width: '250px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              onClick={() => {
                fetchRecipeDetails(recipe.id);
                setDropdownVisible(false);
              }}
              style={{
                padding: '12px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#333',
                borderBottom: '1px solid #ddd',
                textAlign: 'center',
              }}
            >
              {recipe.name}
            </li>
          ))}
        </ul>
      )}

      {selectedRecipe && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <h2 style={{ color: 'black', fontSize: '1.5rem', marginBottom: '20px' }}>{selectedRecipe.name}</h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: '20px',
              flexWrap: 'wrap',
              margin: '0 auto',
              maxWidth: '80%',
            }}
          >
            <div
              style={{
                background: '#A5D6A7',
                borderRadius: '20px',
                padding: '20px',
                flex: '1 1 300px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                minWidth: '300px',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3 style={{ color: 'black', marginBottom: '10px', fontSize: '1.25rem', textAlign: 'center' }}>Ingredients</h3>
              <ul
                style={{
                  fontSize: '16px',
                  color: '#555',
                  lineHeight: '1.6',
                  paddingLeft: '20px',
                  margin: '0',
                  textAlign: 'left',
                }}
              >
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                background: '#A5D6A7',
                borderRadius: '20px',
                padding: '20px',
                flex: '1 1 300px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                minWidth: '300px',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h3 style={{ color: 'black', marginBottom: '10px', fontSize: '1.25rem', textAlign: 'center' }}>Preparation</h3>
              <ul
                style={{
                  fontSize: '16px',
                  color: '#555',
                  lineHeight: '1.6',
                  paddingLeft: '20px',
                  margin: '0',
                  textAlign: 'left',
                }}
              >
                {selectedRecipe.preparation.map((step, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientRecipesPage;