import React, { useState, useEffect } from 'react';
import { Form, Card, Spinner } from 'react-bootstrap';
import { SearchOutlined } from '@mui/icons-material';
import axios from 'axios';
import '../../styles/ClientRecipesPage.css';

const ClientRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/client/recipes');
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchRecipes();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/client/recipes?search=${searchTerm}`);
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipes-page">
      <h1>Recipes</h1>
      <Form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <SearchOutlined />
          </button>
        </div>
      </Form>

      {loading ? (
        <Spinner animation="border" className="loading-spinner" />
      ) : (
        <div className="recipes-list">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="recipe-card">
              <Card.Body>
                <Card.Title>{recipe.name}</Card.Title>
                <Card.Text>
                  <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}
                </Card.Text>
                <Card.Text>
                  <strong>Preparation:</strong> {recipe.preparation.join('. ')}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientRecipesPage;