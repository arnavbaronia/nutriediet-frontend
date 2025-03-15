import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../../auth/token";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "../../styles/ProfilePage.css";

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
    const token = getToken();
    const clientId = localStorage.getItem("client_id");
    const email = localStorage.getItem("email");

    if (!token || !clientId || !email) {
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
        if (response.data.response) {
          const data = response.data.response;
          setProfile({
            ...data,
            age: data.age || "",
            phoneNumber: data.phone_number || "",
            email: email || "",
            height: data.height || "",
            startingWeight: data.starting_weight || "",
            dietaryPreference: data.dietary_preference || "",
            medicalHistory: data.medical_history || "",
            dietRecall: data.diet_recall || "",
          });
        } else {
          setError("Failed to fetch profile data.");
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response?.data?.error || "Error fetching profile.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken();
    const clientId = localStorage.getItem("client_id");
    const email = localStorage.getItem("email");

    if (!token || !clientId || !email) {
      setError("Cannot update profile. Authentication details are missing.");
      return;
    }

    const updatedProfile = {
      ...profile,
      email,
      phone_number: profile.phoneNumber,
      age: profile.age ? parseInt(profile.age, 10) : null,
      height: profile.height ? parseInt(profile.height, 10) : null,
      starting_weight: profile.startingWeight ? parseFloat(profile.startingWeight) : null,
      dietary_preference: profile.dietaryPreference,
      medical_history: profile.medicalHistory,
      diet_recall: profile.dietRecall,
    };

    try {
      await axios.post(
        `http://localhost:8081/clients/${clientId}/my_profile`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Profile updated successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      
    } catch (error) {
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
              onChange={handleChange}
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
              readOnly
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
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;