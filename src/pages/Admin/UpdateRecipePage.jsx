import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateRecipePage.css';

const AdminUpdateRecipePage = () => {
  const { meal_id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Unauthorized: No token found');

        const response = await axios.get(`https://nutriediet-go.onrender.com/admin/recipe/${meal_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedRecipe = response.data.recipe;
        setRecipe({
          id: fetchedRecipe.ID,
          name: fetchedRecipe.Name,
          ingredients: fetchedRecipe.Ingredients.join('\n'),
          preparation: fetchedRecipe.Preparation.join('\n'),
        });
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to fetch recipe.');
      }
    };

    fetchRecipe();
  }, [meal_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized: No token found');

      const payload = {
        id: recipe.id,
        name: recipe.name.trim(),
        ingredients: recipe.ingredients.split('\n').map((ing) => ing.trim()).filter(Boolean),
        preparation: recipe.preparation.split('\n').map((prep) => prep.trim()).filter(Boolean),
      };

      await axios.post(
        `https://nutriediet-go.onrender.com/admin/recipe/${meal_id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigate('/admin/recipes');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to update recipe.');
    }
  };

  if (!recipe) return <p>Loading recipe...</p>;

  return (
    <div className="admin-create-recipe">
      <h1>Update Recipe</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter the recipe name"
            value={recipe.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Ingredients</label>
          <textarea
            name="ingredients"
            placeholder="Enter ingredients, one per line"
            value={recipe.ingredients}
            onChange={handleInputChange}
            rows="8"
            required
          ></textarea>
        </div>
        <div>
          <label>Preparation Steps</label>
          <textarea
            name="preparation"
            placeholder="Enter preparation steps, one per line"
            value={recipe.preparation}
            onChange={handleInputChange}
            rows="8"
            required
          ></textarea>
        </div>
        <button type="submit">Update Recipe</button>
      </form>
    </div>
  );
};

export default AdminUpdateRecipePage;