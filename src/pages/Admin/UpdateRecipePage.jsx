import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import RecipeForm from '../../components/RecipeForm';
import '../../styles/CreateRecipePage.css';
import logger from '../../utils/logger';
import { API_ENDPOINTS } from '../../utils/constants';
import {
  formStateToRecipePayload,
  recipeToFormState,
} from '../../utils/recipeHelpers';

const UpdateRecipePage = () => {
  const { recipe_id } = useParams();
  const [form, setForm] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingRecipe, setFetchingRecipe] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.ADMIN_RECIPE(recipe_id));
        const recipeData = response.data.recipe;

        if (recipeData) {
          setForm(recipeToFormState(recipeData));
        } else {
          throw new Error('Recipe data not found');
        }
      } catch (err) {
        logger.error('Error fetching recipe', err);
        setErrorMessage(
          err.response?.data?.error ||
            'Failed to fetch recipe details. Please try again.'
        );
      } finally {
        setFetchingRecipe(false);
      }
    };

    fetchRecipe();
  }, [recipe_id]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    if (!form?.title?.trim()) {
      setErrorMessage('Recipe title is required');
      setLoading(false);
      return;
    }

    try {
      const payload = formStateToRecipePayload(form);
      await api.post(API_ENDPOINTS.ADMIN_RECIPE(recipe_id), payload);
      setSuccessMessage('Recipe updated successfully!');
      setTimeout(() => {
        navigate('/admin/recipes');
      }, 1500);
    } catch (err) {
      logger.error('Error updating recipe', err);
      setErrorMessage(
        err.response?.data?.error ||
          'Failed to update recipe. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingRecipe) {
    return (
      <div className="admin-create-recipe">
        <div className="loading-container">
          <p className="loading-text">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="admin-create-recipe">
        <p>{errorMessage || 'Recipe not found.'}</p>
      </div>
    );
  }

  return (
    <div className="admin-create-recipe">
      <h1><strong>Update Recipe</strong></h1>

      {successMessage && (
        <div className="success-message-container">
          <div className="success-message28">
            <FaCheckCircle style={{ marginRight: '8px' }} />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="error-message-container11">
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
        submitLabel="Update Recipe"
        loading={loading}
        onCancel={() => navigate('/admin/recipes')}
      />
    </div>
  );
};

export default UpdateRecipePage;
