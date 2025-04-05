import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import CreateDietPage from "./CreateDietPage";
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
    dietitian_id: '',
    group_id: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [diets, setDiets] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [updatedWeight, setUpdatedWeight] = useState("");
  const [feedback, setFeedback] = useState("");
  const [weightUpdateSuccess, setWeightUpdateSuccess] = useState(null);
  const [originalValues, setOriginalValues] = useState({});
  // const [dietHistory, setDietHistory] = useState([]);

  const navigate = useNavigate();
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
    const token = localStorage.getItem("token");
  
    axios
      .get(`https://nutriediet-go.onrender.com/admin/client/${client_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const clientData = response.data.client;
        console.log("Client details response:", response);
  
        const name =
          clientData.name?.trim() ||
          `${clientData.first_name?.trim() || ""} ${
            clientData.last_name?.trim() || ""
          }`.trim() ||
          "N/A";
  
        const formattedClient = {
          ...clientData,
          name,
          amount_paid: clientData.amount_paid?.toString() || "",
          next_payment_date: formatDateForInput(clientData.next_payment_date),
          last_payment_date: formatDateForInput(clientData.last_payment_date),
          date_of_joining: formatDateForInput(clientData.date_of_joining),
          created_at: formatDateForInput(clientData.created_at),
        };
  
        setClient(formattedClient);
        
        setOriginalValues({
          ...clientData,
          name: clientData.name || name,
          amount_paid: clientData.amount_paid,
        });
  
        setDiets(response.data.diets);
        setIsActive(clientData.is_active);
  
        return axios.get(
          `https://nutriediet-go.onrender.com/admin/client/${client_id}/diet_history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
      .then((response) => {
        const dietHistory = response.data.diet_history_regular || [];
        
        const weightDataFromDiet = dietHistory
          .filter(entry => entry && entry.weight) 
          .map(entry => ({
            date: new Date(entry.date),
            weight: parseFloat(entry.weight)
          }))
          .sort((a, b) => a.date - b.date);
        
        setWeightHistory(weightDataFromDiet);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching client details:", error);
        setError("Error fetching client details. Please try again later.");
        setLoading(false);
      });
  }, [client_id]);

  const handleWeightUpdate = async () => {
    const token = localStorage.getItem("token");
  
    if (!updatedWeight) {
      setError("Please enter a valid weight.");
      return;
    }
  
    try {
      const response = await axios.post(
        `https://nutriediet-go.onrender.com/admin/${client_id}/weight_update`,
        {
          weight: parseFloat(updatedWeight),
          feedback: feedback,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        const today = new Date();
        const newWeightEntry = {
          date: today,
          weight: parseFloat(updatedWeight)
        };
        
        const updatedWeightHistory = [...weightHistory, newWeightEntry].sort((a, b) => a.date - b.date);
        
        setWeightHistory(updatedWeightHistory);
        setWeightUpdateSuccess("Weight and feedback updated successfully!");
        setUpdatedWeight("");
        setFeedback("");
  
        setTimeout(() => setWeightUpdateSuccess(null), 3000);
  
        const dietHistoryResponse = await axios.get(
          `https://nutriediet-go.onrender.com/admin/client/${client_id}/diet_history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const dietHistory = dietHistoryResponse.data.diet_history_regular || [];
        
        const weightDataFromDiet = dietHistory
          .filter(entry => entry.weight) 
          .map(entry => ({
            date: new Date(entry.date),
            weight: parseFloat(entry.weight)
          }))
          .sort((a, b) => a.date - b.date);
        
        const combinedWeightHistory = [...weightDataFromDiet];
        
        if (combinedWeightHistory.length !== weightHistory.length) {
          setWeightHistory(combinedWeightHistory);
        }
      }
    } catch (error) {
      console.error("Error updating weight and feedback:", error);
      setError("Failed to update weight and feedback. Please try again.");
    }
  };

  const weightData = {
    labels: weightHistory.map((entry) =>
      entry.date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Weight (kg)",
        data: weightHistory.map((entry) => entry.weight),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: weightHistory.map((entry, index) => {
          if (index > 0) {
            return entry.weight > weightHistory[index - 1].weight ? "red" : "green";
          }
          return "blue";
        }),
        tension: 0.4,
      },
    ],
  };

  const calculateNextPaymentDate = (lastPaymentDate, packageDuration) => {
    console.log(`Calculating Next Payment Date: Last Payment Date = ${lastPaymentDate}, Package = ${packageDuration}`);
  
    if (!lastPaymentDate || !packageDuration) return '';
  
    const normalizedPackage = packageDuration.toLowerCase().replace(/\s+/g, ' ');
  
    const durationMap = {
      "4 weeks": 4,
      "8 weeks": 8,
      "12 weeks": 12,
      "4 week": 4,
      "8 week": 8,
      "12 week": 12,
    };
  
    const weeksToAdd = durationMap[normalizedPackage] || 0;
    if (weeksToAdd === 0) {
      console.warn(`Unknown package duration: ${packageDuration}`);
      return '';
    }
  
    const lastDate = new Date(lastPaymentDate);
    if (isNaN(lastDate.getTime())) {
      console.error(`Invalid date format: ${lastPaymentDate}`);
      return '';
    }
  
    lastDate.setDate(lastDate.getDate() + (weeksToAdd * 7));
  
    const formattedDate = lastDate.toISOString().split('T')[0];
    console.log(`Final Next Payment Date: ${formattedDate}`);
  
    return formattedDate;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`Updated Field: ${name}, Value: ${value}`);

    setClient((prevClient) => {
      const updatedClient = { ...prevClient, [name]: value };

      if (name === "package" || name === "last_payment_date") {
        if (updatedClient.package && updatedClient.last_payment_date) {
          const nextPaymentDate = calculateNextPaymentDate(
            updatedClient.last_payment_date,
            updatedClient.package
          );
          console.log(`Calculated Next Payment Date: ${nextPaymentDate}`);
          updatedClient.next_payment_date = nextPaymentDate;
        }
      }

      return updatedClient;
    });
  };

  const handleActivateDeactivate = async () => {
    const token = localStorage.getItem('token');
    try {
      console.log(`Sending POST request to: /admin/client/${client_id}/activation`);
      console.log('Authorization Token:', token);

      const response = await axios.post(
        `https://nutriediet-go.onrender.com/admin/client/${client_id}/activation`,
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

  // const handleCreateDietClick = (client) => {
  //   localStorage.setItem("selectedClient", JSON.stringify(client));
  //   navigate(`/admin/${client.id}/creatediet`);
  // };

  // const handleDietAction = (action, dietId) => {
  //   console.log(`${action} diet with ID ${dietId}`);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    const payload = {};
    const fieldsToCheck = [
      'name', 'age', 'email', 'city', 'phone_number', 'height', 
      'starting_weight', 'dietary_preference', 'medical_history', 
      'allergies', 'locality', 'diet_recall', 'exercise', 'package', 
      'amount_paid', 'remarks', 'last_payment_date', 'date_of_joining',
      'dietitian_id', 'group_id'
    ];
  
    fieldsToCheck.forEach(field => {
      const currentValue = client[field];
      const originalValue = originalValues[field];
  
      if (currentValue === originalValue) return;
  
      if (field.includes('_date') || field === 'date_of_joining') {
        payload[field] = formatDateForPayload(currentValue);
      } 
      else if (['age', 'height', 'starting_weight', 'amount_paid', 'dietitian_id', 'group_id'].includes(field)) {
        payload[field] = currentValue ? parseInt(currentValue, 10) : null;
      }
      else {
        payload[field] = currentValue;
      }
    });
  
    if (payload.name) {
      const [first_name, ...last_nameArr] = payload.name.split(' ');
      payload.first_name = first_name || '';
      payload.last_name = last_nameArr.join(' ') || '';
    }
  
    if (Object.keys(payload).length === 0) {
      setSuccessMessage('No changes detected.');
      setTimeout(() => setSuccessMessage(null), 3000);
      return;
    }
  
    axios
      .post(`https://nutriediet-go.onrender.com/admin/client/${client_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const updatedClient = response.data.client;
  
        const updatedValues = {
          ...updatedClient,
          name: updatedClient.name || client.name,
          next_payment_date: updatedClient.next_payment_date,
          last_payment_date: updatedClient.last_payment_date,
          date_of_joining: updatedClient.date_of_joining,
          created_at: updatedClient.created_at,
        };
  
        setClient(prev => ({
          ...prev,
          ...updatedValues,
          next_payment_date: formatDateForInput(updatedValues.next_payment_date),
          last_payment_date: formatDateForInput(updatedValues.last_payment_date),
          date_of_joining: formatDateForInput(updatedValues.date_of_joining),
          created_at: formatDateForInput(updatedValues.created_at),
        }));
  
        setOriginalValues(prev => ({
          ...prev,
          ...updatedValues
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
    <div className="client-container">
      {successMessage && (
        <div className="success-message-container">
          <div className="success-message">{successMessage}</div>
        </div>
      )}
      <h2 className="client-heading">{client.name}'s Details</h2>
      <div className="form-row" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 350px)',
        gap: '145px',
        justifyContent: 'center',
        alignItems: 'left',
        marginBottom: '15px'
      }}>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="client_id">Client ID</label>
          <input
            type="text"
            id="client_id"
            name="client_id"
            value={client_id}
            className="client-input"
            readOnly
            style={{ width: '100%', textAlign: 'left' }}
          />
        </div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="name" style={{ textAlign: 'left' }}>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={client.name}
            className="client-input"
            readOnly
            style={{ width: '100%', textAlign: 'left' }}
          />
        </div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="phone_number" style={{ textAlign: 'left' }}>Phone Number</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={client.phone_number}
            className="client-input"
            readOnly
            style={{ width: '100%', textAlign: 'left' }}
          />
        </div>
      </div>
      <CreateDietPage />

      <h2>Weight History</h2>
      {weightHistory.length > 0 ? (
        <div className="weight-history-graph">
          <Line data={weightData} />
        </div>
      ) : (
        <p>No weight history available.</p>
      )}

      <div className="form-group weight-update-container">
        <label htmlFor="updated_weight">Update Weight (kg)</label>
        <input
          type="number"
          id="updated_weight"
          name="updated_weight"
          value={updatedWeight}
          className="client-input"
          style={{ marginTop: '-10px' }}
          onChange={(e) => setUpdatedWeight(e.target.value)}
          placeholder="Enter weight"
        />

        {/* Add feedback input field */}
        <label htmlFor="feedback" style={{ marginTop: '10px' }}>Feedback</label>
        <textarea
          id="feedback"
          name="feedback"
          value={feedback}
          className="feedback-input"
          style={{ marginTop: '-10px', width: '100%', height: '80px' }}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter feedback"
        />

        <button type="button" className="update-weight-btn" onClick={handleWeightUpdate}>
          Update Weight and Feedback
        </button>

        {weightUpdateSuccess && <div className="success-message">{weightUpdateSuccess}</div>}
      </div>

        <div className="form-background">
          <form onSubmit={handleSubmit} className="client-form">

          {/* Name, Age, Phone Number, Email */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="client_id">Client ID</label>
              <input
                type="text"
                id="client_id"
                name="client_id"
                value={client_id}
                className="client-input"
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={client.name}
                className="client-input"
                onChange={handleChange}
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
                readOnly
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
                  className="client-input select-input"
                  onChange={handleChange}
                  style={{ width: '100%', marginRight: '-10px' }}
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
                className="client-input wide-input"
                onChange={handleChange}
                style={{ width: '96%' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="allergies">Allergies</label>
              <input
                type="text"
                id="allergies"
                name="allergies"
                value={client.allergies}
                className="client-input wide-input"
                onChange={handleChange}
                style={{ width: '96%' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exercise">Exercise</label>
              <input
                type="text"
                id="exercise"
                name="exercise"
                value={client.exercise}
                className="client-input wide-input"
                onChange={handleChange}
                style={{ width: '96%' }}
              />
            </div>
          </div>

          {/* Package, Amount Paid, Next Payment Date, Last Payment Date, Date of Joining, Dietitian ID, Group ID */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="package">Package</label>
              <select
                id="package"
                name="package"
                value={client.package}
                className="client-input select-input"
                onChange={handleChange}
                style={{ width: '100%' }}
              >
                <option value="">Select</option>
                <option value="4 Weeks">1 Month</option>
                <option value="8 Weeks">2 Months</option>
                <option value="12 Weeks">3 Months</option>
              </select>
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
              <label htmlFor="last_payment_date">Last Payment Date</label>
              <input
                type="date"
                id="last_payment_date"
                name="last_payment_date"
                value={client.last_payment_date}
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
                value={client.next_payment_date}
                className="client-input"
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="date_of_joining">Date of Joining</label>
              <input
                type="date"
                id="date_of_joining"
                name="date_of_joining"
                value={client.date_of_joining}
                className="client-input"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dietitian_id">Dietitian</label>
              <select
                id="dietitian_id"
                name="dietitian_id"
                value={client.dietitian_id}
                className="client-input select-input"
                onChange={handleChange}
              >
                <option value="">Select Dietitian</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i+1} value={i+1}>Dietitian {i+1}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="group_id">Group</label>
              <select
                id="group_id"
                name="group_id"
                value={client.group_id}
                className="client-input select-input"
                onChange={handleChange}
              >
                <option value="">Select Group</option>
                {[...Array(6)].map((_, i) => (
                  <option key={i+1} value={i+1}>Group {i+1}</option>
                ))}
              </select>
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
      </div>
    </div>
  );
};

export default ClientDetailsPage;