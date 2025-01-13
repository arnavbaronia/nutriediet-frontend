import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateRecipePage.css';

const EditDietTemplatePage = () => {
  const { dietTemplateId } = useParams(); // Get the diet template ID from the URL
  const [dietTemplate, setDietTemplate] = useState({
    name: '',
    diet: [], // Initialize diet as an empty array
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch the diet template by ID
  const fetchDietTemplate = async () => {
    try {
      const response = await api.get(`/admin/diet_templates/${dietTemplateId}`);
      setDietTemplate(response.data.template || { name: '', diet: [] }); // Ensure a default structure
      setError(null);
    } catch (err) {
      console.error('Error fetching diet template:', err);
      setError('Failed to fetch diet template.');
    }
  };

  // Update the diet template
  const updateDietTemplate = async () => {
    try {
      await api.post(`/admin/diet_templates/${dietTemplateId}`, dietTemplate);
      setSuccess('Diet template updated successfully!');
      setError(null);
      setTimeout(() => navigate('/admin/diet-templates'), 1500); // Redirect after success
    } catch (err) {
      console.error('Error updating diet template:', err);
      setError('Failed to update diet template.');
      setSuccess(null);
    }
  };

  // Handle changes to the diet template name or meals
  const handleInputChange = (field, value) => {
    setDietTemplate({ ...dietTemplate, [field]: value });
  };

  // Handle changes to a specific meal in the diet
  const handleMealChange = (index, field, value) => {
    const updatedDiet = dietTemplate.diet.map((meal, i) =>
      i === index ? { ...meal, [field]: value } : meal
    );
    setDietTemplate({ ...dietTemplate, diet: updatedDiet });
  };

  // Add a new meal to the diet
  const addMeal = () => {
    setDietTemplate({
      ...dietTemplate,
      diet: [...dietTemplate.diet, { meal: '', description: '' }],
    });
  };

  // Remove a meal from the diet
  const removeMeal = (index) => {
    const updatedDiet = dietTemplate.diet.filter((_, i) => i !== index);
    setDietTemplate({ ...dietTemplate, diet: updatedDiet });
  };

  useEffect(() => {
    fetchDietTemplate();
  }, [dietTemplateId]);

  return (
    <div className="admin-create-recipe">
      <h1>Edit Diet Template</h1>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={(e) => e.preventDefault()}>
        {/* Template Name Input */}
        <label>Template Name</label>
        <input
          type="text"
          value={dietTemplate.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter template name"
        />

        {/* Meals Section */}
        <h3>Meals</h3>
        {dietTemplate.diet && Array.isArray(dietTemplate.diet) ? ( // Safeguard against undefined or non-array values
          dietTemplate.diet.map((meal, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={meal.meal}
                onChange={(e) => handleMealChange(index, 'meal', e.target.value)}
                placeholder="Enter meal name"
                required
              />
              <textarea
                value={meal.description}
                onChange={(e) =>
                  handleMealChange(index, 'description', e.target.value)
                }
                placeholder="Enter meal description"
                required
              ></textarea>
              <button
                type="button"
                onClick={() => removeMeal(index)}
                style={{ marginLeft: '10px' }}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>No meals available. Add one below.</p>
        )}

        {/* Add New Meal Button */}
        <button type="button" onClick={addMeal}>
          Add Meal
        </button>

        {/* Update and Cancel Buttons */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={updateDietTemplate}>Update Template</button>
          <button
            type="button"
            onClick={() => navigate('/admin/diet-templates')}
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDietTemplatePage;
