import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import "../../styles/EditExercisePage.css";

const EditExercisePage = () => {
  const { id } = useParams();
  const [editExercise, setEditExercise] = useState({ name: '', description: '', link: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'https://nutriediet-go.onrender.com',
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

  const updateExercise = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/exercise/${id}`, editExercise);
      setSuccess('Exercise updated successfully!');
      setError('');
      setTimeout(() => navigate('/admin/exercises'), 1500);
    } catch (err) {
      console.error('Error updating exercise:', err);
      setError('Failed to update exercise. Please try again.');
      setSuccess('');
    }
  };

  useEffect(() => {
    fetchExerciseById();
  }, [id]);

  return (
    <div className="admin-edit-exercise">
      <h1><strong>Edit Exercise</strong></h1>
      
      {success && (
        <div className="success-message-container">
          <div className="success-message15">
            {success}
          </div>
        </div>
      )}
      
      {error && <div className="error-message15"><FaTimes /> {error}</div>}
      
      <form onSubmit={updateExercise}>
        <div>
          <label htmlFor="name">Exercise Name</label>
          <input
            type="text"
            id="name"
            value={editExercise.name}
            onChange={(e) => setEditExercise({ ...editExercise, name: e.target.value })}
            placeholder="Enter exercise name"
            className="small-input"
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={editExercise.description}
            onChange={(e) => setEditExercise({ ...editExercise, description: e.target.value })}
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
            value={editExercise.link}
            onChange={(e) => setEditExercise({ ...editExercise, link: e.target.value })}
            placeholder="Enter YouTube or video link"
            className="small-input"
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Update Exercise</button>
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

export default EditExercisePage;