import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [api1Response, setApi1Response] = useState(null);
  const [api2Response, setApi2Response] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/api-1')
      .then(response => {
        setApi1Response(response.data);
      })
      .catch(error => {
        console.error('Error fetching API-1 data:', error);
        setError(error);
      });

    axios.get('http://localhost:8081/api-2')
      .then(response => {
        setApi2Response(response.data);
      })
      .catch(error => {
        console.error('Error fetching API-2 data:', error);
        setError(error);
      });
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => navigate('/admin')}>Go to Admin Page</button>
      <button onClick={() => navigate('/clients')}>Go to Client Page</button>

      <h2>API 1 Response</h2>
      {api1Response ? <pre>{JSON.stringify(api1Response, null, 2)}</pre> : <p>Loading...</p>}
      
      <h2>API 2 Response</h2>
      {api2Response ? <pre>{JSON.stringify(api2Response, null, 2)}</pre> : <p>Loading...</p>}
      
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default HomePage;
