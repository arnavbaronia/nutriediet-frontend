import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import '../../styles/CreateRecipePage.css';

const CreateRecipePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    ingredients: '',
    preparation: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized: No token found');

      const payload = {
        name: formData.name,
        ingredients: formData.ingredients.split('\n').filter(line => line.trim()),
        preparation: formData.preparation.split('\n').filter(line => line.trim()),
      };

      const response = await axios.post(
        'https://nutriediet-go.onrender.com/admin/recipe/new', 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Recipe created successfully!');
        setFormData({ name: '', ingredients: '', preparation: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-create-recipe">
      {success && (
        <div className="success-message-container">
          <div className="success-message">
            <span>{success}</span>
          </div>
        </div>
      )}

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
        <div className="button-group">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Recipe'}
          </button>
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/admin/recipes')}
          >
            Cancel
          </button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CreateRecipePage;