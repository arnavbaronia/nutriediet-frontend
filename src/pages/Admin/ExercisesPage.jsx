import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/AdminExercisesPage.css';

const ExercisesPage = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [selectedExerciseDetails, setSelectedExerciseDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:8081',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/exercises?timestamp=${Date.now()}`);
      const formattedExercises = response.data.exercises.map((exercise) => ({
        id: exercise.ID,
        name: exercise.Name,
      }));
      setExercises(formattedExercises);
      setError(null);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      setError('Failed to fetch exercises.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExerciseById = async (exerciseId) => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/exercise/${exerciseId}`);
      setSelectedExerciseDetails(response.data.exercise);
      setError(null);
    } catch (err) {
      console.error('Error fetching exercise by ID:', err);
      setError('Failed to fetch exercise details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDropdownChange = (e) => {
    const selectedId = e.target.value;
    setSelectedExerciseId(selectedId);
    if (selectedId) {
      fetchExerciseById(selectedId);
    } else {
      setSelectedExerciseDetails(null);
    }
  };

  const deleteExercise = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/admin/exercise/${exerciseId}/delete`);
      if (response.data.success) {
        await fetchExercises();
        setSelectedExerciseDetails(null);
        setSelectedExerciseId('');
        setError(null);
      } else {
        setError('Failed to delete exercise.');
      }
    } catch (err) {
      console.error('Error deleting exercise:', err);
      setError('Failed to delete exercise.');
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeThumbnail = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|embed\/|v\/|.*\/vi\/))([\w-]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/0.jpg` : null;
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="admin-exercises-container">
      <div className="left-section">
        <h2>Exercises</h2>
        <div className="controls-container">
          <div className="dropdown-container">
            <select
              value={selectedExerciseId}
              onChange={handleDropdownChange}
              className="dropdown-menu"
            >
              <option value="">-- Select an Exercise --</option>
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="new-exercise-button"
            onClick={() => navigate('/admin/exercise/new')}
          >
            + New Exercise
          </button>
        </div>
        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="right-section">
        {selectedExerciseDetails ? (
          <div className="exercise-card">
            <div className="video-container">
              {selectedExerciseDetails.link && (
                <img
                  src={extractYouTubeThumbnail(selectedExerciseDetails.link)}
                  alt="Exercise Thumbnail"
                  className="video-thumbnail"
                />
              )}
              <h3 className="exercise-title">{selectedExerciseDetails.name}</h3>
              <a
                href={selectedExerciseDetails.link}
                target="_blank"
                rel="noopener noreferrer"
                className="exercise-link"
              >
                Watch Video
              </a>
            </div>

            <div className="action-buttons">
              <button onClick={() => navigate(`/admin/exercise/${selectedExerciseId}`)}>
                Edit
              </button>
              <button className="delete" onClick={() => deleteExercise(selectedExerciseId)}>
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="centered-message">
            <p>Select an exercise to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisesPage;
