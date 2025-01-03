import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../styles/ClientDetailsPage.css';

const ClientDetailsPage = () => {
  const { client_id } = useParams();
  const [client, setClient] = useState({
    name: '',
    first_name: '',
    last_name: '',
    age: '',
    email: '',
    city: '',
    phone_number: '',
    height: '',
    starting_weight: '',
    dietary_preference: '',
    medical_history: '',
    allergies: '',
    locality: '',
    diet_recall: '',
    exercise: '',
    package: '',
    amount_paid: '',
    remarks: '',
    next_payment_date: '',
    last_payment_date: '',
    created_at: '',
    date_of_joining: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [diets, setDiets] = useState([]);

  const formatDate = (date) => {
    if (!date) return ''; 
    const isoDate = new Date(date).toISOString();
    return isoDate.split('T')[0]; 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:8081/admin/client/${client_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const clientData = response.data.client;

        const name = clientData.name?.trim() || `${clientData.first_name?.trim() || ''} ${clientData.last_name?.trim() || ''}`.trim() || 'N/A';
        setClient({
          ...clientData,
          name,
        });

        setDiets(response.data.diets);
        setIsActive(clientData.is_active);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching client details:', error);
        setError('Error fetching client details. Please try again later.');
        setLoading(false);
      });
  }, [client_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value
    });
  };

  const handleActivateDeactivate = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:8081/admin/client/${client_id}/activate_deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsActive(!isActive);
    } catch (error) {
      console.error('Error activating/deactivating client:', error);
      setError('Error activating/deactivating client.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      first_name: client.first_name || '',
      last_name: client.last_name || '',
      age: client.age || null,
      email: client.email || '',
      city: client.city || '',
      phone_number: client.phone_number || '',
      height: client.height || null,
      starting_weight: client.starting_weight || null,
      dietary_preference: client.dietary_preference || '',
      medical_history: client.medical_history || '',
      allergies: client.allergies || '',
      locality: client.locality || '',
      diet_recall: client.diet_recall || '',
      exercise: client.exercise || '',
      package: client.package || '',
      amount_paid: client.amount_paid || null,
      remarks: client.remarks || '',
      next_payment_date: client.next_payment_date ? formatDate(client.next_payment_date) : null,
      last_payment_date: client.last_payment_date ? formatDate(client.last_payment_date) : null,
      date_of_joining: client.date_of_joining ? formatDate(client.date_of_joining) : null,
    };

    axios
      .post(`http://localhost:8081/admin/client/${client_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setClient(response.data.client);
        setError(null);
      })
      .catch((error) => {
        console.error('Error updating client info:', error);
        setError('Error updating client info.');
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="client-container">
      <h2 className="client-heading">{client.name}'s Details</h2>
      <form onSubmit={handleSubmit} className="client-form">

        {/* Name, Age, Phone Number, Email */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={client.name}
              className="client-input"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={client.age}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={client.phone_number}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={client.email}
              className="client-input"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* City, Locality, Height, Starting Weight, Dietary Preference */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={client.city}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="locality">Locality</label>
            <input
              type="text"
              id="locality"
              name="locality"
              value={client.locality}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              value={client.height}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="starting_weight">Starting Weight (kg)</label>
            <input
              type="number"
              id="starting_weight"
              name="starting_weight"
              value={client.starting_weight}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dietary_preference">Dietary Preference</label>
            <input
              type="text"
              id="dietary_preference"
              name="dietary_preference"
              value={client.dietary_preference}
              className="client-input"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Medical History, Allergies, Exercise */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="medical_history">Medical History</label>
            <input
              type="text"
              id="medical_history"
              name="medical_history"
              value={client.medical_history}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <input
              type="text"
              id="allergies"
              name="allergies"
              value={client.allergies}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exercise">Exercise</label>
            <input
              type="text"
              id="exercise"
              name="exercise"
              value={client.exercise}
              className="client-input"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Package, Amount Paid, Next Payment Date, Last Payment Date, Date of Joining */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="package">Package</label>
            <input
              type="text"
              id="package"
              name="package"
              value={client.package}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount_paid">Amount Paid (₹)</label>
            <input
              type="number"
              id="amount_paid"
              name="amount_paid"
              value={client.amount_paid}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="next_payment_date">Next Payment Date</label>
            <input
              type="date"
              id="next_payment_date"
              name="next_payment_date"
              value={formatDate(client.next_payment_date)}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="last_payment_date">Last Payment Date</label>
            <input
              type="date"
              id="last_payment_date"
              name="last_payment_date"
              value={formatDate(client.last_payment_date)}
              className="client-input"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="date_of_joining">Date of Joining</label>
            <input
              type="date"
              id="date_of_joining"
              name="date_of_joining"
              value={formatDate(client.date_of_joining)}
              className="client-input"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Diet Recall and Remarks */}
        <div className="form-group">
          <label htmlFor="diet_recall">Diet Recall</label>
          <textarea
            id="diet_recall"
            name="diet_recall"
            value={client.diet_recall}
            onChange={handleChange}
            className="client-textarea client-textarea-large"
          />
        </div>
        <div className="form-group">
          <label htmlFor="remarks">Remarks</label>
          <textarea
            id="remarks"
            name="remarks"
            value={client.remarks}
            onChange={handleChange}
            className="client-textarea client-textarea-large"
          />
        </div>

        <button type="submit" className="update-button">Update</button>
        <button type="button" onClick={handleActivateDeactivate} className="toggle-button">
          {isActive ? 'Deactivate' : 'Activate'} Account
        </button>
      </form>

      <h2>Diet Histories</h2>
      <ul>
        {diets.map(diet => (
          <li key={diet.id}>Week {diet.week_number}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientDetailsPage;