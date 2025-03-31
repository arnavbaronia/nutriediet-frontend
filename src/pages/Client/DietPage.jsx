import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaClipboardList } from 'react-icons/fa';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import '../../styles/DietPage.css';

const DietPage = () => {
  const { client_id } = useParams();
  const [diet, setDiet] = useState('');
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

    const endpoint = type === '1' 
      ? `https://nutriediet-go.onrender.com/clients/${client_id}/detox_diet`
      : `https://nutriediet-go.onrender.com/clients/${client_id}/diet`;

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

  // const fetchDiet = async (type) => {
  //   setLoading(true);
  //   setError(null);
  
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     setError('Authorization token is missing. Please log in again.');
  //     setLoading(false);
  //     return;
  //   }
  
  //   const endpoint = `https://nutriediet-go.onrender.com/clients/${client_id}/diet?dietType=${type}`;
  
  //   try {
  //     const response = await axios.get(endpoint, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  
  //     if (response.data.isActive) {
  //       setDiet(response.data.diet || '');
  //       setIsActive(true);
  //     } else {
  //       setIsActive(false);
  //       setDiet('');
  //     }
  //   } catch (error) {
  //     setError(error.response?.data?.error || 'Failed to fetch diet.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  return (
    <div className="diet-page">
      <h1 className="diet-title">
        <FaClipboardList /> Your Diet Plan
      </h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {!isActive && <Alert variant="warning">Your diet plan is not active.</Alert>}

      <Form.Group className="diet-type-selector">
        <Form.Label>Select Diet Type</Form.Label>
        <Form.Control as="select" value={dietType} onChange={(e) => setDietType(e.target.value)}>
          <option value="0">Regular Diet</option>
          <option value="1">Detox Diet</option>
        </Form.Control>
      </Form.Group>

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

    </div>
  );
};

export default DietPage;