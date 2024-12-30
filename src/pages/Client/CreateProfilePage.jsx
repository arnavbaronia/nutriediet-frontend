import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/ProfilePage.css";

const CreateProfilePage = () => {
  const { email } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { token } = location.state || {};

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    name: "",
    age: "",
    city: "",
    phone_number: "",
    email: email || "",
    height: "",
    starting_weight: "",
    dietary_preference: "",
    medical_history: "",
    allergies: "",
    stay: "",
    exercise: "",
    comments: "",
    diet_recall: "",
    locality: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (firstName && lastName) {
      setFormData((prev) => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(),
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updatedFormData = { ...prev, [name]: value };

      if (name === "first_name" || name === "last_name") {
        updatedFormData.name = `${updatedFormData.first_name} ${updatedFormData.last_name}`.trim();
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `http://localhost:8081/create_profile/${email}`;

      const processedFormData = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        starting_weight: Number(formData.starting_weight),
      };

      const response = await axios.post(url, processedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
      setError(null);
      console.log("Profile created successfully:", response.data);

      navigate("/account-activation", { state: { token } });
    } catch (err) {
      setSuccess(false);
      setError(err.response?.data?.error || "An error occurred.");
      console.error("Error creating profile:", err.response?.data || err.message);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="form-container">
        <h2 className="client-heading">Create New Client Profile</h2>
        {success && <p className="success-message">Client created successfully!</p>}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="client-form">
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={`${formData.first_name} ${formData.last_name}`}
                disabled
                className="client-input"
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="client-input"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="client-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="client-input"
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="client-input"
              />
            </div>
            <div className="form-group">
              <label>Locality</label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                className="client-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Height</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="client-input"
              />
            </div>
            <div className="form-group">
              <label>Starting Weight</label>
              <input
                type="number"
                name="starting_weight"
                value={formData.starting_weight}
                onChange={handleChange}
                className="client-input"
              />
            </div>
            <div className="form-group">
              <label>Dietary Preference</label>
              <input
                type="text"
                name="dietary_preference"
                value={formData.dietary_preference}
                onChange={handleChange}
                className="client-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Medical History</label>
            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Allergies</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Stay</label>
            <textarea
              name="stay"
              value={formData.stay}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Exercise</label>
            <textarea
              name="exercise"
              value={formData.exercise}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
          </div>

          <div className="form-group">
            <label>Diet Recall</label>
            <textarea
              name="diet_recall"
              value={formData.diet_recall}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
          </div>

          <button type="submit" className="update-button">Create Profile</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfilePage;          