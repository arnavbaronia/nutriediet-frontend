import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ProfilePage.css";
import { getToken } from "../../auth/token";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    email: "",
    city: "",
    phoneNumber: "",
    height: "",
    startingWeight: "",
    dietaryPreference: "",
    medicalHistory: "",
    allergies: "",
    stay: "",
    exercise: "",
    comments: "",
    dietRecall: "",
    locality: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching profile for the logged-in user...");
    const token = getToken();
    const clientId = localStorage.getItem("client_id");
    const id = localStorage.getItem("clientId"); 

    if (!token || !clientId || !id) {
      console.error("Missing token, client ID, or id. Redirecting to login...");
      setError("Authentication token, client ID, or id is missing. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8081/clients/${clientId}/my_profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Id: id, 
        },
        withCredentials: true,
      })
      .then((response) => {
        const profileData = response.data.response;
        console.log("Fetched Profile Data:", profileData);

        if (profileData.phoneNumber && !profileData.phoneNumber.startsWith("+91")) {
          profileData.phoneNumber = "+91" + profileData.phoneNumber;
        }

        setProfile(profileData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);

        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/login");
        } else {
          setError(error.response?.data?.message || "Error fetching profile.");
        }
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = getToken();
    const clientId = localStorage.getItem("client_id");
    const id = localStorage.getItem("clientId");

    if (!token || !clientId || !id) {
      setError("Cannot update profile. Authentication token, client ID, or id is missing.");
      return;
    }

    console.log("Submitting updated profile...");
    axios
      .put(
        `http://localhost:8081/clients/${clientId}/update_profile`,
        { ...profile, id }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        alert("Profile updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setError(error.response?.data?.message || "Error updating profile.");
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
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
          <div className="form-group inline-input-wide">
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
          <div className="form-group inline-input-wide">
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
          <div className="form-group inline-input-wide">
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
        <div className="form-group">
          <label htmlFor="height">Height</label>
          <textarea
            id="height"
            name="height"
            value={profile.height}
            onChange={handleChange}
            className="profile-textarea profile-textarea-large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="startingWeight">Starting Weight</label>
          <textarea
            id="startingWeight"
            name="startingWeight"
            value={profile.startingWeight}
            onChange={handleChange}
            className="profile-textarea profile-textarea-large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="dietaryPreference">Dietary Preference</label>
          <textarea
            id="dietaryPreference"
            name="dietaryPreference"
            value={profile.dietaryPreference}
            onChange={handleChange}
            className="profile-textarea profile-textarea-large"
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
          <label htmlFor="stay">Stay</label>
          <textarea
            id="stay"
            name="stay"
            value={profile.stay}
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
