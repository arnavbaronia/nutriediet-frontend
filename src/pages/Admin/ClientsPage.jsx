import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import "../../styles/ClientsPage.css";
import logger from "../../utils/logger";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedDietitian, setSelectedDietitian] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [error, setError] = useState(null);

  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(false);

  const navigate = useNavigate();

  const groupDayMapping = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/admin/clients");

        const activeClients = response.data.active_clients || [];
        const inactiveClients = response.data.inactive_clients || [];

        const allClients = [
          ...activeClients,
          ...inactiveClients,
        ];

        const uniqueClients = Array.from(
          new Map(allClients.map((client) => [client.id, client])).values()
        );

        setClients(uniqueClients);
      } catch (error) {
        logger.error("Error fetching clients", error);
        setError(
          error.response?.data?.err ||
          "An error occurred. Please try again."
        );
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = clients.filter((client) => {

      const isActive = client.is_active === true;
      const isInactive = !isActive;

      const matchesStatus =
        (showActive && isActive) ||
        (showInactive && isInactive);

      if (!matchesStatus) {
        return false;
      }

      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        (client.name || "").toLowerCase().includes(searchTerm) ||
        (client.email || "").toLowerCase().includes(searchTerm);

      let matchesFilters = true;

      if (selectedFilters.includes("diets_due_today")) {
        const today = new Date();
        const todayDay = today.getDay();

        const lastDietDate = client.last_diet_date
          ? new Date(client.last_diet_date)
          : null;

        matchesFilters =
          matchesFilters &&
          client.group_id &&
          groupDayMapping[client.group_id] === todayDay &&
          (!lastDietDate ||
            lastDietDate.toDateString() !== today.toDateString());
      }

      if (selectedFilters.includes("payment_due")) {
        const paymentDate = client.next_payment_date;

        matchesFilters =
          matchesFilters &&
          paymentDate &&
          paymentDate !== "0001-01-01T00:00:00Z" &&
          new Date(paymentDate) < new Date();
      }

      if (selectedFilters.includes("amount_due")) {
        matchesFilters =
          matchesFilters && Number(client.amount_due) > 0;
      }

      const matchesDietitian = selectedDietitian
        ? client.dietitian_id === Number(selectedDietitian)
        : true;

      const matchesGroup = selectedGroup
        ? client.group_id === Number(selectedGroup)
        : true;

      return (
        matchesSearch &&
        matchesFilters &&
        matchesDietitian &&
        matchesGroup
      );
    });

    if (sortConfig) {
      const { key, direction } = sortConfig;

      filtered.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (valueA == null) return 1;
        if (valueB == null) return -1;

        if (valueA < valueB) {
          return direction === "ascending" ? -1 : 1;
        }

        if (valueA > valueB) {
          return direction === "ascending" ? 1 : -1;
        }

        return 0;
      });
    }

    setFilteredClients(filtered);
  }, [
    search,
    selectedFilters,
    selectedDietitian,
    selectedGroup,
    clients,
    showActive,
    showInactive,
    sortConfig,
  ]);

  // Independent Active / Inactive selection
  const handleActiveChange = (e) => {
    setShowActive(e.target.checked);
  };

  const handleInactiveChange = (e) => {
    setShowInactive(e.target.checked);
  };

  const handleSort = (key) => {
    let direction = "ascending";

    if (
      sortConfig?.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;

    if (value && !selectedFilters.includes(value)) {
      setSelectedFilters((prev) => [...prev, value]);
    }

    e.target.value = "";
  };

  const handleDietitianChange = (e) => {
    const value = e.target.value;

    if (value) {
      setSelectedDietitian(value);
    }

    e.target.value = "";
  };

  const handleGroupChange = (e) => {
    const value = e.target.value;

    if (value) {
      setSelectedGroup(value);
    }

    e.target.value = "";
  };

  const removeFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.filter((f) => f !== filter)
    );
  };

  const removeDietitianFilter = () => {
    setSelectedDietitian("");
  };

  const removeGroupFilter = () => {
    setSelectedGroup("");
  };

  const handleMoreDetailsClick = (clientId) => {
    navigate(`/admin/clients/${clientId}`);
  };

  const isPaymentOverdue = (paymentDate) => {
    if (
      !paymentDate ||
      paymentDate === "0001-01-01T00:00:00Z"
    ) {
      return false;
    }

    return new Date(paymentDate) < new Date();
  };

  const getDietitianName = (id) => {
    return `Dietitian ${id}`;
  };

  const getGroupName = (id) => {
    return `Group ${id}`;
  };

  return (
    <div className="clients-page-container">
      <h1>Clients</h1>

      {error && (
        <div className="error-message3">{error}</div>
      )}

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
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )}

                <span
                  className="remove-filter"
                  onClick={() => removeFilter(filter)}
                >
                  ✕
                </span>
              </div>
            ))}

            {selectedDietitian && (
              <div className="filter-tag">
                {getDietitianName(selectedDietitian)}
                <span
                  className="remove-filter"
                  onClick={removeDietitianFilter}
                >
                  ✕
                </span>
              </div>
            )}

            {selectedGroup && (
              <div className="filter-tag">
                {getGroupName(selectedGroup)}
                <span
                  className="remove-filter"
                  onClick={removeGroupFilter}
                >
                  ✕
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="filter-controls">
          <select
            onChange={handleFilterChange}
            className="filter-dropdown"
            value=""
          >
            <option value="">Add Filter</option>
            <option value="diets_due_today">
              Diets Due Today
            </option>
            <option value="payment_due">Payment Due</option>
            <option value="amount_due">Amount Due</option>
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

          {/* Active / Inactive status selection */}
          <div className="client-status-filters">
            <label className="status-filter-option">
              <input
                type="checkbox"
                checked={showActive}
                onChange={handleActiveChange}
              />
              <span>Active</span>
            </label>

            <label className="status-filter-option">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={handleInactiveChange}
              />
              <span>Inactive</span>
            </label>
          </div>
        </div>
      </div>

      <table className="client-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID</th>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("dietitian_id")}>
              Dietitian ID
            </th>
            <th onClick={() => handleSort("group_id")}>Group</th>
            <th onClick={() => handleSort("next_payment_date")}>
              Next Payment Date
            </th>
            <th onClick={() => handleSort("last_diet_date")}>
              Last Diet Date
            </th>
            <th onClick={() => handleSort("amount_due")}>
              Amount Due (₹)
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => {
              const paymentOverdue = isPaymentOverdue(
                client.next_payment_date
              );

              const hasAmountDue =
                Number(client.amount_due) > 0;

              const isInactive = client.is_active !== true;

              return (
                <tr
                  key={client.id}
                  className={`
                    ${paymentOverdue ? "payment-overdue" : ""}
                    ${hasAmountDue ? "amount-due" : ""}
                    ${isInactive ? "inactive-client" : ""}
                  `}
                >
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.dietitian_id || "N/A"}</td>
                  <td>{client.group_id || "N/A"}</td>

                  <td>
                    {!client.next_payment_date ||
                    client.next_payment_date ===
                      "0001-01-01T00:00:00Z"
                      ? "N/A"
                      : new Date(
                          client.next_payment_date
                        ).toLocaleDateString()}
                  </td>

                  <td>
                    {client.last_diet_date
                      ? new Date(
                          client.last_diet_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    {client.amount_due
                      ? `₹${client.amount_due}`
                      : "₹0"}
                  </td>

                  <td>
                    {isInactive ? (
                      <span className="inactive-tag">
                        Inactive
                      </span>
                    ) : (
                      <span className="active-tag">
                        Active
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        handleMoreDetailsClick(client.id)
                      }
                      className="details-button"
                    >
                      More Details
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="no-clients-message">
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="legend-wrapper">
        <div className="legend-card">
          <h4 className="legend-heading">
            Table Color Guide
          </h4>

          <div className="legend-items">
            <div className="legend-row">
              <div className="legend-color payment-overdue-bg"></div>
              <span>Payment overdue</span>
            </div>

            <div className="legend-row">
              <div className="legend-color amount-due-even-bg"></div>
              <span>Amount due</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;