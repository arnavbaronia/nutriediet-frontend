import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaClipboardList, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { Alert, Spinner } from 'react-bootstrap';
import WeightUpdatePage from './WeightUpdatePage';
import '../../styles/DietPage.css';

const DIET_TYPES = {
  REGULAR: '1',
  DETOX: '2',
  DETOX_WATER: '3'
};

const DietPage = () => {
  const { client_id } = useParams();
  const [diet, setDiet] = useState('');
  const [dietType, setDietType] = useState(DIET_TYPES.REGULAR);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [motivations, setMotivations] = useState([]);
  const [currentQuote, setCurrentQuote] = useState('Stay motivated on your health journey!');
  const [loadingMotivations, setLoadingMotivations] = useState(false);
  
  const clientName = JSON.parse(localStorage.getItem('user'))?.name || 'there';

  useEffect(() => {
    fetchDiet(dietType);
    fetchMotivations();
  }, [dietType, client_id]);

  const fetchMotivations = async () => {
    setLoadingMotivations(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoadingMotivations(false);
      return;
    }
  
    try {
      const response = await axios.get(
        `https://nutriediet-go.onrender.com/clients/${client_id}/motivation`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.data.isActive && response.data.motivations?.length > 0) {
        setMotivations(response.data.motivations);
        const randomIndex = Math.floor(Math.random() * response.data.motivations.length);
        setCurrentQuote(response.data.motivations[randomIndex].text);
      } else {
        setCurrentQuote('Stay motivated on your health journey!');
      }
    } catch (error) {
      console.error('Failed to fetch motivations:', error);
      setCurrentQuote('Stay positive and keep working towards your goals!');
    } finally {
      setLoadingMotivations(false);
    }
  };

  const fetchDiet = async (type) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authorization token is missing. Please log in again.');
      setLoading(false);
      return;
    }

    let endpoint;
    switch(type) {
      case DIET_TYPES.REGULAR:
        endpoint = `https://nutriediet-go.onrender.com/clients/${client_id}/diet`;
        break;
      case DIET_TYPES.DETOX:
        endpoint = `https://nutriediet-go.onrender.com/clients/${client_id}/detox_diet`;
        break;
      case DIET_TYPES.DETOX_WATER:
        endpoint = `https://nutriediet-go.onrender.com/clients/${client_id}/detox_water`;
        break;
      default:
        endpoint = `https://nutriediet-go.onrender.com/clients/${client_id}/diet`;
    }

    try {
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.isActive) {
        setDiet(response.data.diet || '');
        setIsActive(true);
      } else {
        setIsActive(false);
        setDiet('');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch diet.');
    } finally {
      setLoading(false);
    }
  };

  const handleDietTypeChange = (type) => {
    setDietType(type);
  };

  return (
    <div className="diet-page">
      <div className="greeting-container">
        <h2 className="greeting-text">Hello, {clientName}!</h2>
        <div className="motivational-quote">
          {loadingMotivations ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <>
              <FaQuoteLeft className="quote-icon left" />
              <p>{currentQuote}</p>
              <FaQuoteRight className="quote-icon right" />
            </>
          )}
        </div>
        <h1 className="diet-title">
          <FaClipboardList /> Your Diet Plan
        </h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {!isActive && <Alert variant="warning">Your diet plan is not active.</Alert>}

      <div className="diet-toggle-container">
        <div className="segmented-control">
          <button
            className={dietType === DIET_TYPES.REGULAR ? 'segment-active' : 'segment'}
            onClick={() => handleDietTypeChange(DIET_TYPES.REGULAR)}
          >
            Regular Diet
          </button>
          <button
            className={dietType === DIET_TYPES.DETOX ? 'segment-active' : 'segment'}
            onClick={() => handleDietTypeChange(DIET_TYPES.DETOX)}
          >
            Detox Diet
          </button>
          <button
            className={dietType === DIET_TYPES.DETOX_WATER ? 'segment-active' : 'segment'}
            onClick={() => handleDietTypeChange(DIET_TYPES.DETOX_WATER)}
          >
            Detox Water
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading diet...</span>
          </Spinner>
        </div>
      ) : (
        <div className="diet-container">
          <p className="diet-content">{diet || "No diet data available."}</p>
        </div>
      )}
      <WeightUpdatePage client_id={client_id} />
    </div>
  );
};

export default DietPage;