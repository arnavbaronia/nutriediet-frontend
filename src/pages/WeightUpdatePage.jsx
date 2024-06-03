import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeightUpdatePage = () => {
  const [weightUpdate, setWeightUpdate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/6/weight_update')
      .then(response => {
        setWeightUpdate(response.data.weight_updates);
      })
      .catch(error => {
        console.error('Error fetching weight update:', error);
        setError(error);
      });
  }, []);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!weightUpdate) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Weight Update</h2>
      <pre>{JSON.stringify(weightUpdate, null, 2)}</pre>
    </div>
  );
};

export default WeightUpdatePage;
