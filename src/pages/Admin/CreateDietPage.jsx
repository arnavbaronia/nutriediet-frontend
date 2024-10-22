import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';

const CreateDietPage = () => {
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [dietPlan, setDietPlan] = useState([]);

  useEffect(() => {
    // Fetch diet templates list
    axios.get('API_URL_TO_GetDietTemplatesLists')
      .then(response => setDietTemplates(response.data))
      .catch(error => console.error('Error fetching diet templates', error));
  }, []);

  const handleTemplateSelect = (templateId) => {
    axios.get(`API_URL_TO_GetDietTemplateByID/${templateId}`)
      .then(response => setSelectedTemplate(response.data))
      .catch(error => console.error('Error fetching template details', error));
  };

  const addMealContainer = () => {
    setDietPlan([...dietPlan, { meal: '', quantity: '' }]);
  };

  const removeMealContainer = (index) => {
    const updatedPlan = dietPlan.filter((_, idx) => idx !== index);
    setDietPlan(updatedPlan);
  };

  const handleMealChange = (index, e) => {
    const updatedPlan = [...dietPlan];
    updatedPlan[index][e.target.name] = e.target.value;
    setDietPlan(updatedPlan);
  };

  return (
    <div className="create-diet-container">
      <h2>Create Diet</h2>

      {/* Accordion for selecting diet template */}
      <Accordion allowToggle>
        {dietTemplates.map((template) => (
          <AccordionItem key={template.id}>
            <h2>
              <AccordionButton onClick={() => handleTemplateSelect(template.id)}>
                <AccordionIcon />
                {template.name}
              </AccordionButton>
            </h2>
            <AccordionPanel>
              {selectedTemplate && selectedTemplate.id === template.id && (
                <div>
                  <p>{selectedTemplate.description}</p>
                  {/* Display other template-specific details */}
                </div>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Dynamic meal containers */}
      <div className="meal-plan-section">
        {dietPlan.map((meal, index) => (
          <div className="meal-container" key={index}>
            <select
              name="meal"
              value={meal.meal}
              onChange={(e) => handleMealChange(index, e)}
            >
              <option value="">Select Meal</option>
              {/* Add meal options */}
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>

            <select
              name="quantity"
              value={meal.quantity}
              onChange={(e) => handleMealChange(index, e)}
            >
              <option value="">Select Quantity</option>
              {/* Add quantity options */}
              <option value="100g">100g</option>
              <option value="200g">200g</option>
            </select>

            <button className="remove-button" onClick={() => removeMealContainer(index)}>
              x
            </button>
          </div>
        ))}

        <button onClick={addMealContainer} className="add-button">
          + Add Meal
        </button>
      </div>
    </div>
  );
};

export default CreateDietPage;
