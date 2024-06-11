import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DietPage.css';

const DietPage = () => {
  const [diet, setDiet] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState('Regular Diet');

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
    return <div>Error: {error.message}</div>;
  }

  if (!diet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="diet-page">
      <div className="diet-content">
        {Object.entries(diet).map(([time, details]) => (
          <div key={time} className="meal-section">
            <h2 className="meal-time">{time}</h2>
            <div className="meal-category">
              <h3 className="meal-category-heading">Primary</h3>
              <div className="meal-items">
                {details.Primary.map(item => (
                  <div key={item.ID} className={`meal-box ${details.Primary.length === 1 ? 'single-box' : ''}`}>
                    <p><strong>{item.Name}</strong></p>
                    <p>{item.Quantity}</p>
                    <p>{item.Preparation}</p>
                    {item.Consumption && <p>{item.Consumption}</p>}
                  </div>
                ))}
              </div>
            </div>
            {details.Alternative && (
              <div className="meal-category">
                <h3 className="meal-category-heading">Alternatives</h3>
                <div className="meal-items">
                  {details.Alternative.map(item => (
                    <div key={item.ID} className={`meal-box ${details.Alternative.length === 1 ? 'single-box' : ''}`}>
                      <p><strong>{item.Name}</strong></p>
                      <p>{item.Quantity}</p>
                      <p>{item.Preparation}</p>
                      {item.Consumption && <p>{item.Consumption}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="diet-buttons">
        <button
          className={`diet-type-button ${selectedDiet === 'Regular Diet' ? 'active-diet' : ''}`}
          onClick={() => setSelectedDiet('Regular Diet')}
        >
          Regular Diet
        </button>
        <button
          className={`diet-type-button ${selectedDiet === 'Detox Diet' ? 'active-diet' : ''}`}
          onClick={() => setSelectedDiet('Detox Diet')}
        >
          Detox Diet
        </button>
      </div>
    </div>
  );
};

export default DietPage;
