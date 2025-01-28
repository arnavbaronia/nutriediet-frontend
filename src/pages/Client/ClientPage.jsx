import React from 'react';
import { Link } from 'react-router-dom';

const ClientPage = ({ clientId }) => {
  return (
    <div>
      <h1>Client Page</h1>
      <Link to={`/clients/${clientId}/my_profile`}>Profile</Link>
      <Link to={`/clients/${clientId}/diet`}>Diet</Link>
      <Link to={`/clients/${clientId}/weight_update`}>Weight Update</Link>
    </div>
  );
};

export default ClientPage;
