import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import RecipeForm from '../../components/RecipeForm';
import '../../styles/CreateRecipePage.css';
import logger from '../../utils/logger';
import { API_ENDPOINTS } from '../../utils/constants';
import {
  emptyRecipePayload,
  formStateToRecipePayload,
  recipeToFormState,
} from '../../utils/recipeHelpers';

const CreateRecipePage = () => {
  const [form, setForm] = useState(recipeToFormState(emptyRecipePayload()));
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!form.title.trim()) {
      setErrorMessage('Please provide a recipe title');
      setLoading(false);
      return;
    }

    try {
      const payload = formStateToRecipePayload(form);
      await api.post(API_ENDPOINTS.ADMIN_RECIPE_NEW, payload);
      setSuccessMessage('Recipe created successfully!');
      setTimeout(() => {
        navigate('/admin/recipes');
      }, 1500);
    } catch (err) {
      logger.error('Error creating recipe', err);
      setErrorMessage(
        err.response?.data?.error ||
          'Failed to create recipe. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-create-recipe">
      <h1><strong>Create a New Recipe</strong></h1>

      {successMessage && (
        <div className="success-message-container">
          <div className="success-message28">
            <FaCheckCircle style={{ marginRight: '8px' }} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="error-message-container">
          <div className="error-message28">
            <FaExclamationTriangle style={{ marginRight: '8px' }} />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <RecipeForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitLabel="Create Recipe"
        loading={loading}
        onCancel={() => navigate('/admin/recipes')}
      />
    </div>
  );
};

export default CreateRecipePage;
