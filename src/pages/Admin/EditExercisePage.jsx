import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/CreateRecipePage.css';

const EditExercisePage = () => {
  const { id } = useParams();
  const [editExercise, setEditExercise] = useState({ name: '', description: '', link: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchExerciseById = async () => {
    try {
      const response = await api.get(`/admin/exercise/${id}`);
      setEditExercise(response.data.exercise);
    } catch (err) {
      console.error('Error fetching exercise details:', err);
      setError('Failed to fetch exercise details.');
    }
  };

  const updateExercise = async () => {
    try {
      await api.post(`/admin/exercise/${id}`, editExercise);
      setSuccess('Exercise updated successfully!');
      setError(null);
      setTimeout(() => navigate('/admin/exercises'), 1500);
    } catch (err) {
      console.error('Error updating exercise:', err);
      setError('Failed to update exercise.');
      setSuccess(null);
    }
  };

  useEffect(() => {
    fetchExerciseById();
  }, [id]);

  return (
    <div className="admin-create-recipe">
      <h1>Edit Exercise</h1>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Name</label>
        <input
          type="text"
          value={editExercise.name}
          onChange={(e) => setEditExercise({ ...editExercise, name: e.target.value })}
          placeholder="Enter exercise name"
        />
        <label>Description</label>
        <textarea
          value={editExercise.description}
          onChange={(e) => setEditExercise({ ...editExercise, description: e.target.value })}
          placeholder="Enter exercise description"
        ></textarea>
        <label>Link</label>
        <input
          type="text"
          value={editExercise.link}
          onChange={(e) => setEditExercise({ ...editExercise, link: e.target.value })}
          placeholder="Enter exercise link"
        />
        <button onClick={updateExercise}>Update Exercise</button>
      </form>
    </div>
  );
};

export default EditExercisePage;