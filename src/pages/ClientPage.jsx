import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_DIET = gql`
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
            // Add other meals similarly...
        }
    }
`;

const ClientPage = () => {
    const { loading, error, data } = useQuery(GET_DIET, {
        variables: { id: "6" },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : </p>;

    const diet = data.diet;

    return (
        <div>
            <h1>Diet Plan</h1>
            {Object.entries(diet).map(([meal, details]) => (
                <div key={meal}>
                    <h2>{meal}</h2>
                    <h3>Primary</h3>
                    <ul>
                        {details.Primary.map(item => (
                            <li key={item.ID}>
                                <strong>{item.Name}</strong>: {item.Quantity} ({item.Preparation}) {item.Consumption && `- ${item.Consumption}`}
                            </li>
                        ))}
                    </ul>
                    <h3>Alternative</h3>
                    <ul>
                        {details.Alternative.map(item => (
                            <li key={item.ID}>
                                <strong>{item.Name}</strong>: {item.Quantity} ({item.Preparation}) {item.Consumption && `- ${item.Consumption}`}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default ClientPage;
