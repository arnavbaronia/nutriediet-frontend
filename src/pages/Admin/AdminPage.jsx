import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavBar from '../../components/AdminNavBar';

const AdminPage = () => {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/exercise')
      .then(response => {
        setExercises(response.data);
      })
      .catch(error => {
        console.error('Error fetching exercises:', error);
        setError(error);
      });
  }, []);

  return (
    <div>
      <AdminNavBar />
      <h1>Admin Page</h1>
      <h2>Exercise List</h2>
      {exercises.length > 0 ? (
        exercises.map(exercise => (
          <div key={exercise.ID}>
            <p>{exercise.Name}</p>
            <button onClick={() => axios.post(`http://localhost:8081/exercise/${exercise.ID}/delete`)
              .then(response => {
                setExercises(exercises.filter(ex => ex.ID !== exercise.ID));
              })
              .catch(error => {
                console.error('Error deleting exercise:', error);
                setError(error);
              })}>Delete</button>
            <button onClick={() => console.log(`Edit exercise ${exercise.ID}`)}>Edit</button>
          </div>
        ))
      ) : <p>Loading...</p>}
      
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default AdminPage;
