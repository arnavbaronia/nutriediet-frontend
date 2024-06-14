import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    email: '',
    city: '',
    phoneNumber: '',
    height: '',
    startingWeight: '',
    dietaryPreference: '',
    medicalHistory: '',
    allergies: '',
    stay: '',
    exercise: '',
    comments: '',
    dietRecall: '',
    locality: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/6/my_profile')
      .then(response => {
        const profileData = response.data.response;
        delete profileData.created_at;
        delete profileData.updated_at;
        delete profileData.dateOfJoining;
        delete profileData.lastPaymentDate;
        delete profileData.nextPaymentDate;
        if (profileData.phoneNumber && !profileData.phoneNumber.startsWith('+91')) {
          profileData.phoneNumber = '+91' + profileData.phoneNumber;
        }

        setProfile(profileData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('http://localhost:8081/6/my_profile', profile)
      .then(response => {
        console.log('Profile updated successfully', response.data);
      })
      .catch(error => {
        console.error('There was an error updating the profile!', error);
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-heading">My Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group-inline">
          <div className="form-group inline-input-wide">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              className="profile-input"
              readOnly
            />
          </div>
          <div className="form-group inline-input-wide">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={profile.phoneNumber}
              className="profile-input"
              readOnly
            />
          </div>
          <div className="form-group inline-input-wide">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={profile.email}
              className="profile-input"
              readOnly
            />
          </div>
        </div>
        <div className="form-group-inline">
          <div className="form-group inline-input">
            <label htmlFor="age">Age</label>
            <input
              type="text"
              id="age"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <div className="form-group inline-input">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={profile.city}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <div className="form-group inline-input">
            <label htmlFor="locality">Locality</label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={profile.locality}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
        </div>
        <div className="form-group-inline">
          <div className="form-group inline-input">
            <label htmlFor="height">Height</label>
            <input
              type="text"
              id="height"
              name="height"
              value={profile.height}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <div className="form-group inline-input">
            <label htmlFor="startingWeight">Starting Weight</label>
            <input
              type="text"
              id="startingWeight"
              name="startingWeight"
              value={profile.startingWeight}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
          <div className="form-group inline-input">
            <label htmlFor="dietaryPreference">Dietary Preference</label>
            <select
              id="dietaryPreference"
              name="dietaryPreference"
              value={profile.dietaryPreference}
              onChange={handleChange}
              className="profile-input"
            >
              <option value="">Select Preference</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Eggetarian">Eggetarian</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="stay">Stay</label>
          <input
            type="text"
            id="stay"
            name="stay"
            value={profile.stay}
            onChange={handleChange}
            className="profile-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="medicalHistory">Medical History</label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            value={profile.medicalHistory}
            onChange={handleChange}
            className="profile-textarea profile-textarea-large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="allergies">Allergies</label>
          <textarea
            id="allergies"
            name="allergies"
            value={profile.allergies}
            onChange={handleChange}
            className="profile-textarea profile-textarea-large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="exercise">Exercise</label>
          <textarea
            id="exercise"
            name="exercise"
            value={profile.exercise}
            onChange={handleChange}
            className="profile-textarea profile-textarea-large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            name="comments"
            value={profile.comments}
            onChange={handleChange}
            className="profile-textarea profile-textarea-large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dietRecall">Diet Recall</label>
          <textarea
            id="dietRecall"
            name="dietRecall"
            value={profile.dietRecall}
            onChange={handleChange}
            className="profile-textarea profile-textarea-large"
          />
        </div>
        <button type="submit" className="update-button">Update</button>
      </form>
    </div>
  );
};

export default ProfilePage;
