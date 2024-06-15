import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeightUpdatePage = () => {
  const [weightUpdate, setWeightUpdate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/6/weight_update')
      .then(response => {
        setWeightUpdate(response.data);
      })
      .catch(error => {
        console.error('Error fetching weight update:', error);
        setError(error);
      });
  }, []);

  return (
    <div>
      <h1>Weight Update</h1>
      {weightUpdate ? <pre>{JSON.stringify(weightUpdate, null, 2)}</pre> : <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default WeightUpdatePage;
