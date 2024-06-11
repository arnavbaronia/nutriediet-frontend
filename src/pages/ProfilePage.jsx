import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/6/my_profile')
      .then(response => {
        setProfile(response.data.response);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setError(error);
      });
  }, []);

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  const {
    name,
    age,
    email,
    city,
    phoneNumber,
    height,
    startingWeight,
    dietaryPreference,
    medicalHistory,
    allergies,
    stay,
    exercise,
    comments,
    dietRecall,
    locality
  } = profile;

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Age:</strong> {age}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>City:</strong> {city}</p>
        <p><strong>Phone Number:</strong> {phoneNumber}</p>
        <p><strong>Height:</strong> {height}</p>
        <p><strong>Starting Weight:</strong> {startingWeight}</p>
        <p><strong>Dietary Preference:</strong> {dietaryPreference}</p>
        <p><strong>Medical History:</strong> {medicalHistory}</p>
        <p><strong>Allergies:</strong> {allergies}</p>
        <p><strong>Stay:</strong> {stay}</p>
        <p><strong>Exercise:</strong> {exercise}</p>
        <p><strong>Comments:</strong> {comments}</p>
        <p><strong>Diet Recall:</strong> {dietRecall}</p>
        <p><strong>Locality:</strong> {locality}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
