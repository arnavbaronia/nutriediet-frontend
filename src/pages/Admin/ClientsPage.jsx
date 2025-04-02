import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/ClientsPage.css";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedDietitian, setSelectedDietitian] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchClients = async () => {
      try {
        const response = await axios.get("https://nutriediet-go.onrender.com/admin/clients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setClients(response.data.clients);
        setFilteredClients(response.data.clients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setError(error.response?.data?.err || "An error occurred. Please try again.");
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = clients.filter((client) => {
      const matchesSearch =
        (client.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (client.email?.toLowerCase() || "").includes(search.toLowerCase());

      let matchesFilters = true;
      if (selectedFilters.includes("diets_due_today")) {
        matchesFilters =
          matchesFilters &&
          new Date(client.last_diet_date).toDateString() === new Date().toDateString();
      }
      if (selectedFilters.includes("payment_due")) {
        matchesFilters = matchesFilters && new Date(client.next_payment_date) < new Date();
      }
      if (selectedFilters.includes("inactive_clients")) {
        matchesFilters = matchesFilters && (client.is_active === false || client.is_active === undefined);
      }

      const matchesDietitian = selectedDietitian ? client.dietitian_id === Number(selectedDietitian) : true;
      const matchesGroup = selectedGroup ? client.group_id === Number(selectedGroup) : true;

      return matchesSearch && matchesFilters && matchesDietitian && matchesGroup;
    });

    setFilteredClients(filtered);
  }, [search, selectedFilters, selectedDietitian, selectedGroup, clients]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedClients = [...filteredClients].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setFilteredClients(sortedClients);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    if (value && !selectedFilters.includes(value)) {
      setSelectedFilters([...selectedFilters, value]);
    }
    e.target.value = "";
  };

  const handleDietitianChange = (e) => {
    setSelectedDietitian(e.target.value);
    e.target.value = "";
  };

  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    e.target.value = "";
  };

  const removeFilter = (filter) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter));
  };

  const handleMoreDetailsClick = (clientId) => {
    navigate(`/admin/client/${clientId}`);
  };

  const isPaymentOverdue = (paymentDate) => {
    if (paymentDate === "0001-01-01T00:00:00Z") return false;
    return new Date(paymentDate) < new Date();
  };

  return (
    <div className="clients-page-container">
      <h1>Clients</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="filters-container">
        <div className="search-and-filters">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={handleSearchChange}
            className="search-bar"
          />
          <div className="selected-filters">
            {selectedFilters.map((filter) => (
              <div key={filter} className="filter-tag">
                {filter
                  .replace("_", " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
                <span className="remove-filter" onClick={() => removeFilter(filter)}>
                  ✕
                </span>
              </div>
            ))}
          </div>
        </div>

        <select 
          onChange={handleFilterChange} 
          className="filter-dropdown"
          value=""
        >
          <option value="">Add Filter</option>
          <option value="diets_due_today">Diets Due Today</option>
          <option value="payment_due">Payment Due</option>
          <option value="inactive_clients">Inactive Clients</option>
        </select>

        <select 
          onChange={handleDietitianChange} 
          className="filter-dropdown"
          value=""
        >
          <option value="">Dietitian</option>
          <option value="1">Dietitian ID: 1</option>
          <option value="2">Dietitian ID: 2</option>
          <option value="3">Dietitian ID: 3</option>
          <option value="4">Dietitian ID: 4</option>
          <option value="5">Dietitian ID: 5</option>
          <option value="6">Dietitian ID: 6</option>
          <option value="7">Dietitian ID: 7</option>
          <option value="8">Dietitian ID: 8</option>
          <option value="9">Dietitian ID: 9</option>
          <option value="10">Dietitian ID: 10</option>
        </select>

        <select 
          onChange={handleGroupChange} 
          className="filter-dropdown"
          value=""
        >
          <option value="">Group</option>
          <option value="1">Group: 1</option>
          <option value="2">Group: 2</option>
          <option value="3">Group: 3</option>
          <option value="4">Group: 4</option>
          <option value="5">Group: 5</option>
          <option value="6">Group: 6</option>
        </select>
      </div>

      <table className="client-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("dietitian_id")}>Dietitian ID</th>
            <th onClick={() => handleSort("group_id")}>Group</th>
            <th onClick={() => handleSort("next_payment_date")}>Next Payment Date</th>
            <th onClick={() => handleSort("last_diet_date")}>Last Diet Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => {
            const paymentOverdue = isPaymentOverdue(client.next_payment_date);
            return (
              <tr 
                key={client.id} 
                className={paymentOverdue ? "payment-overdue" : ""}
              >
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.dietitian_id || "N/A"}</td>
                <td>{client.group_id || "N/A"}</td>
                <td>
                  {client.next_payment_date === "0001-01-01T00:00:00Z"
                    ? "N/A"
                    : new Date(client.next_payment_date).toLocaleDateString()}
                </td>
                <td>{client.last_diet_date ? new Date(client.last_diet_date).toLocaleDateString() : "N/A"}</td>
                <td>
                  <button onClick={() => handleMoreDetailsClick(client.id)} className="details-button">
                    More Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsPage;