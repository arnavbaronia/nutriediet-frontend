import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import '../../styles/DietPage.css';

const DietPage = () => {
  const { client_id } = useParams();
  const [diet, setDiet] = useState({});
  const [dietType, setDietType] = useState('0'); 
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDiet(dietType);
  }, [dietType, client_id]);

  const fetchDiet = async (type) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authorization token is missing. Please log in again.');
      setLoading(false);
      return;
    }

    const endpoint = type === '2' 
      ? `http://localhost:8081/clients/${client_id}/detox_diet`
      : `http://localhost:8081/clients/${client_id}/diet`;

    try {
      console.log("Fetching diet from:", endpoint);
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Diet response:", response.data);

      if (response.data.isActive) {
        setDiet(response.data.diet || {});
        setIsActive(true);
      } else {
        setIsActive(false);
        setDiet({});
      }
    } catch (error) {
      console.error('Error fetching diet:', error);
      setError(error.response?.data?.error || 'Failed to fetch diet.');
    } finally {
      setLoading(false);
    }
  };

  const renderMealSection = (mealType, mealData) => {
    if (!mealData) return null;

    return (
      <div className="meal-section" key={mealType}>
        <div className="meal-header">
          <h3 className="meal-title">{mealType}</h3>
          <p className="meal-timing"><strong>Timing:</strong> {mealData.Timing || 'Not specified'}</p>
        </div>

        {mealData.Primary && mealData.Primary.length > 0 && (
          <>
            <h4 className="meal-subtitle">Primary Meals</h4>
            <div className="meal-box-container">
              {mealData.Primary.map((meal, index) => (
                <div key={index} className="meal-box">
                  <p><strong>Name:</strong> {meal.Name || 'N/A'}</p>
                  <p><strong>Quantity:</strong> {meal.Quantity || 'N/A'}</p>
                  <p><strong>Preparation:</strong> {meal.Preparation || 'N/A'}</p>
                  <p><strong>Consumption:</strong> {meal.Consumption || 'N/A'}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {mealData.Alternative && Array.isArray(mealData.Alternative) && mealData.Alternative.length > 0 && (
          <>
            <h4 className="meal-subtitle">Alternative Meals</h4>
            <div className="meal-box-container">
              {mealData.Alternative.map((meal, index) => (
                <div key={index} className="meal-box">
                  <p><strong>Name:</strong> {meal.Name || 'N/A'}</p>
                  <p><strong>Quantity:</strong> {meal.Quantity || 'N/A'}</p>
                  <p><strong>Preparation:</strong> {meal.Preparation || 'N/A'}</p>
                  <p><strong>Consumption:</strong> {meal.Consumption || 'N/A'}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="diet-page">
      <h1 className="diet-title">Your Diet Plan</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {!isActive && <Alert variant="warning">Your diet plan is not active.</Alert>}

      <Form.Group className="diet-type-selector">
        <Form.Label>Select Diet Type</Form.Label>
        <Form.Control as="select" value={dietType} onChange={(e) => setDietType(e.target.value)}>
          <option value="0">Regular Diet</option>
          <option value="2">Detox Diet</option>
        </Form.Control>
      </Form.Group>

      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading diet...</span>
          </Spinner>
        </div>
      ) : (
        Object.keys(diet).length > 0 ? (
          Object.entries(diet).map(([mealType, mealData]) => renderMealSection(mealType, mealData))
        ) : (
          <p>No diet data available.</p>
        )
      )}

      <Button variant="primary" onClick={() => fetchDiet(dietType)}>Refresh</Button>
    </div>
  );
};

export default DietPage;