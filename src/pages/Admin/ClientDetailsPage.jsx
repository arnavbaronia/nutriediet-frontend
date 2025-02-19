import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
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
    date_of_joining: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [diets, setDiets] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  console.log('Client ID:', client_id);

  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  const formatDateForPayload = (date) => {
    if (!date) return null;
    return new Date(date).toISOString();
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:8081/admin/client/${client_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const clientData = response.data.client;
        console.log("Client details response:", response);
        const name = clientData.name?.trim() || 
          `${clientData.first_name?.trim() || ''} ${clientData.last_name?.trim() || ''}`.trim() || 
          'N/A';

        setClient({
          ...clientData,
          name,
          amount_paid: clientData.amount_paid?.toString() || '',
          next_payment_date: formatDateForInput(clientData.next_payment_date),
          last_payment_date: formatDateForInput(clientData.last_payment_date),
          date_of_joining: formatDateForInput(clientData.date_of_joining),
          created_at: formatDateForInput(clientData.created_at),
        });

        setDiets(response.data.diets);
        setIsActive(clientData.is_active);
        return axios
        .get(`http://localhost:8081/admin/client/${client_id}/weight_history`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      })
      .then((response) => {
        setWeightHistory(response.data.weights || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching client details:', error);
        setError('Error fetching client details. Please try again later.');
        setLoading(false);
    });
  }, [client_id]);
  
  const weightData = {
    labels: weightHistory.map((entry) =>
      new Date(entry.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    ),
    datasets: [
      {
        label: 'Weight (kg)',
        data: weightHistory.map((entry) => entry.weight),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: weightHistory.map((entry, index) => {
          if (index > 0) {
            return entry.weight > weightHistory[index - 1].weight ? 'red' : 'green';
          }
          return 'blue';
        }),
        tension: 0.4,
      },
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({
      ...client,
      [name]: value,
    });
  };
  
  const handleActivateDeactivate = async () => {
    const token = localStorage.getItem('token');
    try {
      console.log(`Sending POST request to: /admin/client/${client_id}/activation`);
      console.log('Authorization Token:', token);
  
      const response = await axios.post(
        `http://localhost:8081/admin/client/${client_id}/activation`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log('Response from server:', response);
  
      if (response.data.success) {
        setIsActive((prevState) => !prevState);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to activate/deactivate the client.');
      }
      console.log('Updated activation status:', !isActive);
    } catch (error) {
      console.error('Error activating/deactivating client:', error);
      setError('Error activating/deactivating client. Please try again later.');
    }
  };  

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const [first_name, ...last_nameArr] = client.name.split(' ');
    const last_name = last_nameArr.join(' ');

    const payload = {
      name: client.name || '',
      first_name: first_name || '',
      last_name: last_name || '',
      age: client.age ? parseInt(client.age, 10) : null,
      email: client.email || '',
      city: client.city || '',
      phone_number: client.phone_number || '',
      height: client.height ? parseInt(client.height, 10) : null,
      starting_weight: client.starting_weight ? parseInt(client.starting_weight, 10) : null,
      dietary_preference: client.dietary_preference || '',
      medical_history: client.medical_history || '',
      allergies: client.allergies || '',
      locality: client.locality || '',
      diet_recall: client.diet_recall || '',
      exercise: client.exercise || '',
      package: client.package || '',
      amount_paid: client.amount_paid ? parseInt(client.amount_paid, 10) : null,
      remarks: client.remarks || '',
      next_payment_date: formatDateForPayload(client.next_payment_date),
      last_payment_date: formatDateForPayload(client.last_payment_date),
      date_of_joining: formatDateForPayload(client.date_of_joining),
      created_at: formatDateForPayload(client.created_at),
    };

    axios
      .post(`http://localhost:8081/admin/client/${client_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const updatedClient = response.data.client;

        setClient((prevState) => ({
          ...prevState,
          ...updatedClient,
          name: prevState.name,
        }));
        setError(null);
        setSuccessMessage('Details updated successfully!'); 
        setTimeout(() => setSuccessMessage(null), 3000);
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
    <div className="client-container">{successMessage && <p className="success-message">{successMessage}</p>}
      <h2 className="client-heading">{client.name}'s Details</h2>
        <div className="form-background">
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
                <select
                  id="dietary_preference"
                  name="dietary_preference"
                  value={client.dietary_preference}
                  className="client-input"
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Eggetarian">Eggetarian</option>
                </select>
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
                value={(client.next_payment_date)}
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
                value={(client.last_payment_date)}
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
                value={(client.date_of_joining)}
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
        <h2>Weight History</h2>
        {weightHistory.length > 0 ? (
          <div className="weight-history-graph">
            <Line data={weightData} />
          </div>
        ) : (
          <p>No weight history available.</p>
        )}
      </div>
    </div>
  );
};

export default ClientDetailsPage;