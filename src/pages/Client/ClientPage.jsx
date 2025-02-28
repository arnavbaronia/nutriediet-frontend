import React from 'react';

const ClientPage = () => {
  const clientName = JSON.parse(localStorage.getItem('user'))?.name || 'N/A';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh' }}>
      <h1>Hello! {clientName}</h1>
    </div>
  );
};

export default ClientPage;