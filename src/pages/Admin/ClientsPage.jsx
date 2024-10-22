import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import '../../styles/ClientsPage.css'; 

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data.clients);
        setFilteredClients(response.data.clients); 
      } catch (error) {
        console.error('Error fetching clients:', error);
        if (error.response) {
          setError(error.response.data.err || 'Unknown error occurred');
        } else {
          setError('Error fetching clients. Please try again later.');
        }
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    setFilteredClients(
      clients.filter(client =>
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, clients]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleMoreDetailsClick = (clientId) => {
    navigate(`/admin/client/${clientId}`); // Redirect to the new client details page
  };

  return (
    <div className="clients-page-container">
      <h1>Clients</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <table className="client-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Next Payment Date</th>
            <th>Last Diet Date</th>
            <th>Actions</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {filteredClients.map(client => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.next_payment_date === "0001-01-01T05:30:00+05:30" ? 'N/A' : new Date(client.next_payment_date).toLocaleDateString()}</td>
              <td>{client.last_diet_date ? new Date(client.last_diet_date).toLocaleDateString() : 'N/A'}</td>
              <td>
                <button onClick={() => handleMoreDetailsClick(client.id)}>
                  More Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsPage;
