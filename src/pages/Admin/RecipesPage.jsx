import React, { useState } from 'react';
import axios from 'axios';

const AdminCreateRecipePage = () => {
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
    <div>
      <h1>Create a New Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Ingredients (each on a new line)</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            rows="6"
            required
          ></textarea>
        </div>
        <div>
          <label>Preparation Steps (each on a new line)</label>
          <textarea
            name="preparation"
            value={formData.preparation}
            onChange={handleInputChange}
            rows="6"
            required
          ></textarea>
        </div>
        <button type="submit">Create Recipe</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default AdminCreateRecipePage;