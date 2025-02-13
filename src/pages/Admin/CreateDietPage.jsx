import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateDietPage.css';

const CreateDietPage = () => {
  const { client_id } = useParams();
  const [clientName, setClientName] = useState('');
  const [dietType, setDietType] = useState(0);
  const [meals, setMeals] = useState({
    wakingUp: { timing: '', primary: [{ name: '', quantity: '', preparation: '', consumption: '' }], alternative: [] },
    breakfast: { timing: '', primary: [{ name: '', quantity: '', preparation: '', consumption: '' }], alternative: [] },
    midMorning: { timing: '', primary: [{ name: '', quantity: '', preparation: '', consumption: '' }], alternative: [] },
    lunch: { timing: '', primary: [{ name: '', quantity: '', preparation: '', consumption: '' }], alternative: [] },
    dinner: { timing: '', primary: [{ name: '', quantity: '', preparation: '', consumption: '' }], alternative: [] },
    night: { timing: '', primary: [{ name: '', quantity: '', preparation: '', consumption: '' }], alternative: [] },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Authorization token is missing. Please log in again.");
      return;
    }

    const fetchClientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/admin/clients/${client_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientName(response.data.client.name || 'Unknown Client');
      } catch (error) {
        console.error('Error fetching client details:', error);
        setError(error.response?.data?.err || 'Failed to load client details.');
      }
    };

    fetchClientDetails();
  }, [client_id]);

  const addMeal = (type, category) => {
    setMeals({
      ...meals,
      [type]: {
        ...meals[type],
        [category]: [...meals[type][category], { name: '', quantity: '', preparation: '', consumption: '' }]
      }
    });
  };

  const removeMeal = (type, category, index) => {
    setMeals({
      ...meals,
      [type]: {
        ...meals[type],
        [category]: meals[type][category].filter((_, i) => i !== index)
      }
    });
  };

  const handleMealChange = (type, category, index, field, value) => {
    const updatedMeals = [...meals[type][category]];
    updatedMeals[index][field] = value;
    setMeals({ ...meals, [type]: { ...meals[type], [category]: updatedMeals } });
  };

  const handleTimingChange = (type, value) => {
    setMeals({ ...meals, [type]: { ...meals[type], timing: value } });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    const dietData = {
      Diet: {
        'On Waking Up': { Timing: meals.wakingUp.timing, Primary: meals.wakingUp.primary, Alternative: meals.wakingUp.alternative },
        Breakfast: { Timing: meals.breakfast.timing, Primary: meals.breakfast.primary, Alternative: meals.breakfast.alternative },
        'MidMorning': { Timing: meals.midMorning.timing, Primary: meals.midMorning.primary, Alternative: meals.midMorning.alternative },
        Lunch: { Timing: meals.lunch.timing, Primary: meals.lunch.primary, Alternative: meals.lunch.alternative },
        Dinner: { Timing: meals.dinner.timing, Primary: meals.dinner.primary, Alternative: meals.dinner.alternative },
        Night: { Timing: meals.night.timing, Primary: meals.night.primary, Alternative: meals.night.alternative },
      },
      DietType: Number(dietType),
      WeekNumber: 1,
    };

    try {
      const response = await axios.post(`http://localhost:8081/admin/${client_id}/diet`, dietData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      console.log('Diet Saved:', response.data);
      alert('Diet saved successfully!');
      localStorage.setItem('dietUpdated', 'true');
    } catch (error) {
      console.error('Error saving diet:', error.response?.data || error);
      setError(error.response?.data?.err || 'Failed to save diet. Please try again.');
    }
  };

  const renderMealSection = (mealType, title) => (
    <div className="meal-section" key={mealType}>
      <h3>{title}</h3>
      <Form.Control
        type="text"
        placeholder="Timing"
        value={meals[mealType].timing}
        onChange={(e) => handleTimingChange(mealType, e.target.value)}
      />

      {/* Primary Meals */}
      <h4>Primary</h4>
      {meals[mealType].primary.map((meal, index) => (
        <div key={index} className="meal-box">
          <Form.Control type="text" placeholder="Meal Name" value={meal.name} onChange={(e) => handleMealChange(mealType, 'primary', index, 'name', e.target.value)} />
          <Form.Control type="text" placeholder="Quantity" value={meal.quantity} onChange={(e) => handleMealChange(mealType, 'primary', index, 'quantity', e.target.value)} />
          <Form.Control type="text" placeholder="Preparation" value={meal.preparation} onChange={(e) => handleMealChange(mealType, 'primary', index, 'preparation', e.target.value)} />
          <Form.Control type="text" placeholder="Consumption" value={meal.consumption} onChange={(e) => handleMealChange(mealType, 'primary', index, 'consumption', e.target.value)} />
          <Button variant="danger" onClick={() => removeMeal(mealType, 'primary', index)}>Remove</Button>
        </div>
      ))}
      <Button variant="primary" onClick={() => addMeal(mealType, 'primary')}>Add Primary Meal</Button>

      {/* Alternative Meals */}
      <h4>Alternative</h4>
      {meals[mealType].alternative.map((meal, index) => (
        <div key={index} className="meal-box">
          <Form.Control type="text" placeholder="Meal Name" value={meal.name} onChange={(e) => handleMealChange(mealType, 'alternative', index, 'name', e.target.value)} />
          <Form.Control type="text" placeholder="Quantity" value={meal.quantity} onChange={(e) => handleMealChange(mealType, 'alternative', index, 'quantity', e.target.value)} />
          <Form.Control type="text" placeholder="Preparation" value={meal.preparation} onChange={(e) => handleMealChange(mealType, 'alternative', index, 'preparation', e.target.value)} />
          <Form.Control type="text" placeholder="Consumption" value={meal.consumption} onChange={(e) => handleMealChange(mealType, 'alternative', index, 'consumption', e.target.value)} />
          <Button variant="danger" onClick={() => removeMeal(mealType, 'alternative', index)}>Remove</Button>
        </div>
      ))}
      <Button variant="secondary" onClick={() => addMeal(mealType, 'alternative')}>Add Alternative Meal</Button>
    </div>
  );

  return (
    <div className="create-diet-page">
      <h1>Create Diet</h1>
      {error && <div className="error-message">{error}</div>}
      <h2>For: {clientName} (ID: {client_id})</h2>
      {renderMealSection('wakingUp', 'On Waking Up')}
      {renderMealSection('breakfast', 'Breakfast')}
      {renderMealSection('midMorning', 'Mid Morning')}
      {renderMealSection('lunch', 'Lunch')}
      {renderMealSection('dinner', 'Dinner')}
      {renderMealSection('night', 'Night')}
      <Button variant="success" onClick={handleSubmit}>Save Diet</Button>
    </div>
  );
};

export default CreateDietPage;
