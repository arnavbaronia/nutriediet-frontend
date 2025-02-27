import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/CreateRecipePage.css';

const CreateRecipePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    preparation: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized: No token found');

      const payload = {
        name: formData.name,
        ingredients: formData.ingredients.split('\n'),
        preparation: formData.preparation.split('\n'),
      };

      const response = await axios.post('http://localhost:8081/admin/recipe/new', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSuccessMessage('Recipe created successfully!');
        setErrorMessage('');
        setFormData({ name: '', ingredients: '', preparation: '' });
      }
    } catch (err) {
      setErrorMessage('Failed to create recipe. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="admin-create-recipe">
      <h1>Create a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Recipe Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter the recipe name"
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            rows="6"
            placeholder="Enter ingredients, one per line"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="preparation">Preparation Steps</label>
          <textarea
            id="preparation"
            name="preparation"
            value={formData.preparation}
            onChange={handleInputChange}
            rows="6"
            placeholder="Enter preparation steps, one per line"
            required
          ></textarea>
        </div>
        <button type="submit">Create Recipe</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CreateRecipePage;