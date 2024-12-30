import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/ClientsPage.css';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8081/admin/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const clientsWithNames = response.data.clients.map((client) => ({
          ...client,
          name: client.name ||
            `${client.first_name || ''} ${client.last_name || ''}`.trim() ||
            'N/A',
        }));

        setClients(clientsWithNames);
        setFilteredClients(clientsWithNames);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError(error.response?.data?.err || 'An error occurred. Please try again.');
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter((client) => {
      const matchesSearch =
        (client.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (client.email?.toLowerCase() || '').includes(search.toLowerCase());

      if (filter === 'diets_due_today') {
        return (
          matchesSearch &&
          new Date(client.next_diet_date).toDateString() === new Date().toDateString()
        );
      }
      if (filter === 'payment_due') {
        return matchesSearch && new Date(client.next_payment_date) < new Date();
      }
      return matchesSearch;
    });

    setFilteredClients(filtered);
  }, [search, filter, clients]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedClients = [...filteredClients].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });

    setFilteredClients(sortedClients);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleMoreDetailsClick = (clientId) => {
    navigate(`/admin/client/${clientId}`);
  };

  return (
    <div className="clients-page-container">
      <h1>Clients</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearchChange}
          className="search-bar"
        />
        <select value={filter} onChange={handleFilterChange} className="filter-dropdown">
          <option value="">All</option>
          <option value="diets_due_today">Diets Due Today</option>
          <option value="payment_due">Payment Due</option>
        </select>
      </div>

      <table className="client-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('email')}>Email</th>
            <th onClick={() => handleSort('next_payment_date')}>Next Payment Date</th>
            <th onClick={() => handleSort('last_diet_date')}>Last Diet Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email || 'N/A'}</td>
              <td>
                {client.next_payment_date === '0001-01-01T00:00:00Z'
                  ? 'N/A'
                  : new Date(client.next_payment_date).toLocaleDateString()}
              </td>
              <td>{client.last_diet_date ? new Date(client.last_diet_date).toLocaleDateString() : 'N/A'}</td>
              <td>
                <button onClick={() => handleMoreDetailsClick(client.id)} className="details-button">
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