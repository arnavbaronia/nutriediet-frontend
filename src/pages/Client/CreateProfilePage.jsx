import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import api from '../../api/axiosInstance';
import "../../styles/ProfilePage.css";
import logger from "../../utils/logger";

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
  const [fieldErrors, setFieldErrors] = useState({});
  const [backendError, setBackendError] = useState(null);

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

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (backendError) {
      setBackendError(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'age', 'city', 'phone_number', 'height', 'starting_weight', 
      'dietary_preference', 'medical_history', 'allergies', 
      'stay', 'exercise', 'locality'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const url = `/create_profile/${email}`;

      const processedFormData = {
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        starting_weight: Number(formData.starting_weight),
      };

      const response = await api.post(url, processedFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(true);
      setError(null);
      setBackendError(null);

      navigate("/account-activation", { state: { token } });
    } catch (err) {
      setSuccess(false);
      
      if (err.response) {
        const { data, status } = err.response;
        
        if (status === 400) {
          if (data.error === "email does not match") {
            setBackendError("Email in the form doesn't match the registered email");
          } else {
            setBackendError("Invalid form data. Please check your inputs.");
          }
        } else if (status === 403) {
          setBackendError("User needs to sign up before creating a profile");
        } else if (status === 404) {
          setBackendError("User record not found");
        } else if (status === 500) {
          setBackendError("Server error. Please try again later.");
        } else {
          setBackendError(data.error || "An unexpected error occurred");
        }
      } else {
        setBackendError("Network error. Please check your connection.");
      }
      
      logger.error("Error creating profile", err);
    }
  };

  const RequiredStar = () => <span className="required-star">*</span>;

  return (
    <div className="profile-container">
      <div className="form-container">
        <h2 className="client-heading">Create New Client Profile</h2>
        {success && <p className="success-message">Client created successfully!</p>}
        {error && <p className="error-message4">{error}</p>}

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
              <label>Age <RequiredStar /></label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="client-input"
              />
              {fieldErrors.age && <span className="field-error">{fieldErrors.age}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number <RequiredStar /></label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="client-input"
              />
              {fieldErrors.phone_number && <span className="field-error">{fieldErrors.phone_number}</span>}
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
              <label>City <RequiredStar /></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="client-input"
              />
              {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
            </div>
            <div className="form-group">
              <label>Locality <RequiredStar /></label>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                className="client-input"
              />
              {fieldErrors.locality && <span className="field-error">{fieldErrors.locality}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Height (cm) <RequiredStar /></label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="client-input"
              />
              {fieldErrors.height && <span className="field-error">{fieldErrors.height}</span>}
            </div>
            <div className="form-group">
              <label>Starting Weight <RequiredStar /></label>
              <input
                type="number"
                name="starting_weight"
                value={formData.starting_weight}
                onChange={handleChange}
                className="client-input"
              />
              {fieldErrors.starting_weight && <span className="field-error">{fieldErrors.starting_weight}</span>}
            </div>
            <div className="form-group">
              <label>Dietary Preference <RequiredStar /></label>
              <select
                name="dietary_preference"
                value={formData.dietary_preference}
                onChange={handleChange}
                className="client-input"
                style={{ width: "100%" }}
              >
                <option value="">Select</option>
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Eggetarian">Eggetarian</option>
              </select>
              {fieldErrors.dietary_preference && <span className="field-error">{fieldErrors.dietary_preference}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Medical History <RequiredStar /></label>
            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
            {fieldErrors.medical_history && <span className="field-error">{fieldErrors.medical_history}</span>}
          </div>

          <div className="form-group">
            <label>Allergies <RequiredStar /></label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
            {fieldErrors.allergies && <span className="field-error">{fieldErrors.allergies}</span>}
          </div>

          <div className="form-group">
            <label>Stay <RequiredStar /></label>
            <textarea
              name="stay"
              value={formData.stay}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
            {fieldErrors.stay && <span className="field-error">{fieldErrors.stay}</span>}
          </div>

          <div className="form-group">
            <label>Exercise <RequiredStar /></label>
            <textarea
              name="exercise"
              value={formData.exercise}
              onChange={handleChange}
              className="client-textarea"
            ></textarea>
            {fieldErrors.exercise && <span className="field-error">{fieldErrors.exercise}</span>}
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