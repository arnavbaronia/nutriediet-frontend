import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaClipboardList, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { Alert, Spinner } from 'react-bootstrap';
import WeightUpdatePage from './WeightUpdatePage';
import WeightChart from './WeightChart';
import '../../styles/DietPage.css';

const DIET_TYPES = {
  REGULAR: '1',
  DETOX: '2',
  DETOX_WATER: '3'
};

const DietPage = () => {
  const { client_id } = useParams();
  const [diets, setDiets] = useState({
    regular_diet: null,
    detox_diet: null,
    detox_water: null
  });
  const [dietType, setDietType] = useState(DIET_TYPES.REGULAR);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [motivations, setMotivations] = useState([]);
  const [currentQuote, setCurrentQuote] = useState('Stay motivated on your health journey!');
  const [loadingMotivations, setLoadingMotivations] = useState(false);
  const [weightUpdateTrigger, setWeightUpdateTrigger] = useState(0);
  
  const clientName = JSON.parse(localStorage.getItem('user'))?.name || 'there';

  useEffect(() => {
    fetchAllDiets();
    fetchMotivations();
  }, [client_id], weightUpdateTrigger);

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

  const fetchAllDiets = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authorization token is missing. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://nutriediet-go.onrender.com/clients/${client_id}/diet`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.isActive === false) {
        setIsActive(false);
      } else {
        setIsActive(true);
        setDiets({
          regular_diet: response.data.regular_diet || null,
          detox_diet: response.data.detox_diet || null,
          detox_water: response.data.detox_water || null
        });
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

  const getCurrentDiet = () => {
    return {
      [DIET_TYPES.REGULAR]: diets.regular_diet,
      [DIET_TYPES.DETOX]: diets.detox_diet,
      [DIET_TYPES.DETOX_WATER]: diets.detox_water
    }[dietType] || null;
  };

  const getDietDate = () => {
    const diet = getCurrentDiet();
    if (!diet || !diet.date) return null;
    
    const date = new Date(diet.date);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDietTitle = () => {
    switch(dietType) {
      case DIET_TYPES.REGULAR: return 'Regular Diet';
      case DIET_TYPES.DETOX: return 'Detox Diet';
      case DIET_TYPES.DETOX_WATER: return 'Detox Water';
      default: return 'Diet Plan';
    }
  };

  const renderDietContent = () => {
    const diet = getCurrentDiet();
    if (!diet || !diet.diet_string) return "No diet data available.";
    
    return (
      <div 
        className="diet-html-content"
        dangerouslySetInnerHTML={{ __html: diet.diet_string }}
      />
    );
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
          <FaClipboardList /> {getDietTitle()}
        </h1>
        {getDietDate() && (
          <p className="diet-date">Last updated: {getDietDate()}</p>
        )}
        {error && (
          <div
            className="error-message4"
            style={{ width: '20%', margin: '0 auto', textAlign: 'center' }}
          >
            {error}
          </div>
        )}
      </div>

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
          {renderDietContent()}
        </div>
      )}
      <h1 className="diet-title">
        <TrendingDownIcon /> Your Weight Progress
      </h1>
      <WeightChart 
        clientId={client_id} 
        refreshTrigger={weightUpdateTrigger}
      />
      <WeightUpdatePage 
        client_id={client_id} 
        onWeightUpdate={() => setWeightUpdateTrigger(prev => prev + 1)} 
      />
    </div>
  );
};

export default DietPage;