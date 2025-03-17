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

        setClient({
          ...clientData,
          name,
          amount_paid: clientData.amount_paid?.toString() || "",
          next_payment_date: formatDateForInput(clientData.next_payment_date),
          last_payment_date: formatDateForInput(clientData.last_payment_date),
          date_of_joining: formatDateForInput(clientData.date_of_joining),
          created_at: formatDateForInput(clientData.created_at),
        });

        setDiets(response.data.diets);
        setIsActive(clientData.is_active);

        return axios.get(
          `https://nutriediet-go.onrender.com/admin/client/${client_id}/weight_history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
      .then((response) => {
        console.log("Weight history response:", response);

        setWeightHistory(response.data.response || []);
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
        setWeightUpdateSuccess("Weight and feedback updated successfully!");
        setUpdatedWeight("");
        setFeedback("");

        setTimeout(() => setWeightUpdateSuccess(null), 3000);

        const weightResponse = await axios.get(
          `https://nutriediet-go.onrender.com/admin/client/${client_id}/weight_history`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setWeightHistory(weightResponse.data.response || []);
      }
    } catch (error) {
      console.error("Error updating weight and feedback:", error);
      setError("Failed to update weight and feedback. Please try again.");
    }
  };

  const weightData = {
    labels: weightHistory.map((entry) =>
      new Date(entry.date).toLocaleDateString("en-GB", {
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
      "1 month": 1,
      "2 months": 2,
      "3 months": 3,
      "6 months": 6,
      "1 month": 1,
      "2 month": 2,
      "3 month": 3,
      "6 month": 6,
    };

    const monthsToAdd = durationMap[normalizedPackage] || 0;
    if (monthsToAdd === 0) {
      console.warn(`Unknown package duration: ${packageDuration}`);
      return '';
    }

    const lastDate = new Date(lastPaymentDate);
    if (isNaN(lastDate.getTime())) {
      console.error(`Invalid date format: ${lastPaymentDate}`);
      return '';
    }

    const dayOfMonth = lastDate.getDate();

    lastDate.setDate(1);
    lastDate.setMonth(lastDate.getMonth() + monthsToAdd);

    const maxDaysInMonth = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0).getDate();
    lastDate.setDate(Math.min(dayOfMonth, maxDaysInMonth));

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
      .post(`https://nutriediet-go.onrender.com/admin/client/${client_id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const updatedClient = response.data.client;

        setClient((prevState) => ({
          ...prevState,
          ...updatedClient,
          name: prevState.name,
          next_payment_date: formatDateForInput(updatedClient.next_payment_date),
          last_payment_date: formatDateForInput(updatedClient.last_payment_date),
          date_of_joining: formatDateForInput(updatedClient.date_of_joining),
          created_at: formatDateForInput(updatedClient.created_at),
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
      {successMessage && <p className="success-message">{successMessage}</p>}
      <h2 className="client-heading">{client.name}'s Details</h2>
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
            style={{ width: '390px' }}
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

          {/* Package, Amount Paid, Next Payment Date, Last Payment Date, Date of Joining */}
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
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
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