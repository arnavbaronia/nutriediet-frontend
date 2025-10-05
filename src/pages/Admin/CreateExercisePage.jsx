import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import '../../styles/CreateExercisePage.css';
import { FaTimes } from 'react-icons/fa';
import logger from '../../utils/logger';

const CreateExercisePage = () => {
  const [exercise, setExercise] = useState({ name: '', description: '', link: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const handleCreateExercise = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/exercise/new', exercise);
      setSuccess('Exercise created successfully!');
      setError('');
      setTimeout(() => navigate('/admin/exercises'), 1500);
    } catch (err) {
      logger.error('Error creating exercise', err);
      setError('Failed to create exercise. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="admin-create-exercise">
      <h1><strong>Create New Exercise</strong></h1>
      
      {success && (
        <div className="success-message-container">
          <div className="success-message23">
            {success}
          </div>
        </div>
      )}
      
      {error && <div className="error-message23"><FaTimes /> {error}</div>}
      
      <form onSubmit={handleCreateExercise}>
        <div>
          <label htmlFor="name">Exercise Name</label>
          <input
            type="text"
            id="name"
            value={exercise.name}
            onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
            placeholder="Enter exercise name"
            className="small-input"
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={exercise.description}
            onChange={(e) => setExercise({ ...exercise, description: e.target.value })}
            placeholder="Enter exercise description"
            className="large-input"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="link">Video Link</label>
          <input
            type="text"
            id="link"
            value={exercise.link}
            onChange={(e) => setExercise({ ...exercise, link: e.target.value })}
            placeholder="Enter YouTube or video link"
            className="small-input"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Create Exercise</button>
          <button 
            type="button" 
            className="cancel-btn3"
            onClick={() => navigate('/admin/exercises')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExercisePage;