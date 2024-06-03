import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DietPage = () => {
  const [diet, setDiet] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/6/diet')
      .then(response => {
        setDiet(response.data.diet);
      })
      .catch(error => {
        console.error('Error fetching diet:', error);
        setError(error);
      });
  }, []);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!diet) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Diet</h2>
      {Object.entries(diet).map(([time, details]) => (
        <div key={time}>
          <h3>{time}</h3>
          <div>
            <h4>Primary</h4>
            {details.Primary.map(item => (
              <div key={item.ID}>
                <p>Name: {item.Name}</p>
                <p>Quantity: {item.Quantity}</p>
                <p>Preparation: {item.Preparation}</p>
                {item.Consumption && <p>Consumption: {item.Consumption}</p>}
              </div>
            ))}
          </div>
          <div>
            <h4>Alternative</h4>
            {details.Alternative.map(item => (
              <div key={item.ID}>
                <p>Name: {item.Name}</p>
                <p>Quantity: {item.Quantity}</p>
                <p>Preparation: {item.Preparation}</p>
                {item.Consumption && <p>Consumption: {item.Consumption}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DietPage;
