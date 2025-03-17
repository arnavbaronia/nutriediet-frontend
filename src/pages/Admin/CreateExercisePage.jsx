import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateExercisePage.css';

const CreateExercisePage = () => {
  const [exercise, setExercise] = useState({ name: '', description: '', link: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'https://nutriediet-go.onrender.com',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const handleCreateExercise = async () => {
    try {
      await api.post('/admin/exercise/new', exercise);
      setSuccess('Exercise created successfully!');
      setError(null);
      setTimeout(() => navigate('/admin/exercises'), 1500);
    } catch (err) {
      console.error('Error creating exercise:', err);
      setError('Failed to create exercise.');
      setSuccess(null);
    }
  };

  return (
    <div className="create-exercise-page">
      <h1>Create Exercise</h1>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Name</label>
        <input
          type="text"
          value={exercise.name}
          onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
          placeholder="Enter exercise name"
        />
        <label>Description</label>
        <textarea
          value={exercise.description}
          onChange={(e) => setExercise({ ...exercise, description: e.target.value })}
          placeholder="Enter exercise description"
        ></textarea>
        <label>Link</label>
        <input
          type="text"
          value={exercise.link}
          onChange={(e) => setExercise({ ...exercise, link: e.target.value })}
          placeholder="Enter exercise link"
        />
        <button onClick={handleCreateExercise}>Create Exercise</button>
      </form>
    </div>
  );
};

export default CreateExercisePage;