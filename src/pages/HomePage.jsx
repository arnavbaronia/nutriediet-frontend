import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; 

const HomePage = () => {
  const navigate = useNavigate();
  const [api1Response, setApi1Response] = useState(null);
  const [api2Response, setApi2Response] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/api-1')
      .then(response => setApi1Response(response.data))
      .catch(error => {
        console.error('Error fetching API-1 data:', error);
        setError(error);
      });

    axios.get('http://localhost:8081/api-2')
      .then(response => setApi2Response(response.data))
      .catch(error => {
        console.error('Error fetching API-2 data:', error);
        setError(error);
      });
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Home Page / Landing Page</h1>
      <div className="button-group">
        <button className="admin-button" onClick={() => navigate('/admin')}>Go to Admin Page</button>
        <button className="client-button" onClick={() => navigate('/clients')}>Go to Client Page</button>
        <button className="admin-login-button" onClick={() => navigate('/admin/login')}>Go to Admin Login</button>
      </div>
    </div>
  );
};

export default HomePage;