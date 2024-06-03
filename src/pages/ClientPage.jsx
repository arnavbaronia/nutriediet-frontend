import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClientPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Client Page</h1>
      <button onClick={() => handleNavigation('/client/profile')}>Profile</button>
      <button onClick={() => handleNavigation('/client/diet')}>Diet</button>
      <button onClick={() => handleNavigation('/client/weight-update')}>Weight Update</button>
    </div>
  );
};

export default ClientPage;
