import React from 'react';
import { Link } from 'react-router-dom';

const ClientPage = ({ clientId }) => {
  return (
    <div>
      <h1>Client Page</h1>
      <Link to={`/client/${clientId}/my_profile`}>Profile</Link>
      <Link to={`/client/${clientId}/diet`}>Diet</Link>
      <Link to={`/client/${clientId}/weight_update`}>Weight Update</Link>
    </div>
  );
};

export default ClientPage;
