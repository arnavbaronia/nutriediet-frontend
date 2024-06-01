import React from 'react';
import { useQuery, gql } from '@apollo/client';

{/*const GET_DIET = gql`
  query GetDiet($id: ID!) {
    diet(id: $id) {
      OnWakingUp {
        Timing
        Primary {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
        Alternative {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
      }
      Breakfast {
        Timing
        Primary {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
        Alternative {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
      }
      MidMorning {
        Timing
        Primary {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
        Alternative {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
      }
      Lunch {
        Timing
        Primary {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
        Alternative {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
      }
      Dinner {
        Timing
        Primary {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
        Alternative {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
      }
      Night {
        Timing
        Primary {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
        Alternative {
          ID
          Name
          Quantity
          Preparation
          Consumption
        }
      }
    }
  }
`;*/}

const HomePage = () => {
  /*const { loading, error, data } = useQuery(GET_DIET, {
    variables: { id: 6 }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : </p>;*/

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
    </div>
  );
};

export default HomePage;
