import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ADMIN_DATA = gql`
  query GetAdminData {
    adminData {
      id
      name
      role
    }
  }
`;

const AdminPage = () => {
  const { loading, error, data } = useQuery(GET_ADMIN_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Admin Page</h1>
      <ul>
        {data.adminData.map((admin) => (
          <li key={admin.id}>
            <h2>{admin.name}</h2>
            <p>Role: {admin.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
