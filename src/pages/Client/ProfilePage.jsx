import React, { useState, useEffect } from "react";
import axios from "axios";
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
    console.log("ProfilePage Mounted");

    const token = getToken();
    const clientId = localStorage.getItem("client_id");
    const email = localStorage.getItem("email");

    console.log("Retrieved from localStorage:");
    console.log("Token:", token);
    console.log("Client ID:", clientId);
    console.log("Email:", email);

    if (!token || !clientId || !email) {
      console.error("Missing token, client ID, or email.");
      setError("Session expired. Please log in again.");
      localStorage.clear();
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:8081/clients/${clientId}/my_profile`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Fetched Profile Data:", response.data);
        if (response.data.response) {
          setProfile({
            ...response.data.response,
            phoneNumber: response.data.response.phone_number || "",
            email: email || "",
            dietaryPreference: response.data.response.dietary_preference || "",
            medicalHistory: response.data.response.medical_history || "",
            startingWeight: response.data.response.starting_weight || "",
          });
        } else {
          console.error("Unexpected response structure:", response.data);
          setError("Failed to fetch profile data.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        console.error("Error response:", error.response);
        setError(error.response?.data?.error || "Error fetching profile.");
        setLoading(false);
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating field ${name} with value ${value}`);
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Profile Update...");
    console.log("Updated Profile Data:", profile);

    const token = getToken();
    const clientId = localStorage.getItem("client_id");
    const email = localStorage.getItem("email");

    if (!token || !clientId || !email) {
      console.error("Authentication details missing. Cannot update profile.");
      setError("Cannot update profile. Authentication details are missing.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/clients/${clientId}/my_profile`,
        {
          ...profile,
          email, 
          phone_number: profile.phoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("Profile updated successfully:", response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error response:", error.response);
      setError(error.response?.data?.error || "Error updating profile.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-heading">My Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Inline group for Name, Phone Number, and Email */}
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

        {/* Inline group for Age, City, and Locality */}
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

        {/* Inline group for Height, Starting Weight, and Dietary Preference */}
        <div className="form-group-inline">
          <div className="form-group inline-input-wide">
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
          <div className="form-group inline-input-wide">
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
          <div className="form-group inline-input-wide">
            <label htmlFor="dietaryPreference">Dietary Preference</label>
            <input
              type="text"
              id="dietaryPreference"
              name="dietaryPreference"
              value={profile.dietaryPreference}
              onChange={handleChange}
              className="profile-input"
            />
          </div>
        </div>

        {/* Remaining form fields */}
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
        <button type="submit" className="update-button">
          Update
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
