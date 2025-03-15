import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ClientDetailsPage.css';

const DietHistoryTable = ({ clientId, handleDietAction, handleDelete }) => {
    const [dietType, setDietType] = useState('regular');
    const [dietHistory, setDietHistory] = useState({ regular: [], detox: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDietHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found. Please log in again.');
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `http://localhost:8081/admin/client/${clientId}/diet_history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const { diet_history_regular, diet_history_detox } = response.data;

            const formattedRegular = diet_history_regular.map(diet => ({
                id: diet.id,
                week: diet.week_number,
                date: new Intl.DateTimeFormat('en-GB').format(new Date(diet.date)),
                weight: diet.weight || '-',
                dietString: diet.diet_string,
                feedback: diet.feedback || '-'
            }));

            const formattedDetox = diet_history_detox.map(diet => ({
                id: diet.id,
                week: diet.week_number,
                date: new Intl.DateTimeFormat('en-GB').format(new Date(diet.date)),
                dietString: diet.diet_string,
                feedback: diet.feedback || '-'
            }));

            setDietHistory({
                regular: formattedRegular,
                detox: formattedDetox
            });
        } catch (err) {
            setError('Failed to fetch diet history. Please try again.');
            console.error('Error fetching diet history:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clientId) {
            fetchDietHistory();
        }
    }, [clientId]);

    const handleDietTypeChange = (type) => {
        setDietType(type);
    };

    const handleDeleteDiet = async (dietId) => {
        try {
            await handleDelete(dietId);
            setDietHistory(prevHistory => ({
                regular: prevHistory.regular.filter(diet => diet.id !== dietId),
                detox: prevHistory.detox.filter(diet => diet.id !== dietId)
            }));
        } catch (error) {
            console.error("Error deleting diet:", error);
            setError("Failed to delete diet.");
        }
    };

    const filteredDietHistory = dietType === 'regular'
        ? dietHistory.regular
        : dietHistory.detox;

    const latestRegularDietId = dietHistory.regular.length > 0 ? dietHistory.regular[dietHistory.regular.length - 1].id : null;
    const latestDetoxDietId = dietHistory.detox.length > 0 ? dietHistory.detox[dietHistory.detox.length - 1].id : null;

    return (
        <div className="diet-history-wrapper">
            {/* Diet Type Selection */}
            <div className="diet-toggle-container">
                <h2 className="diet-type-heading">Select Diet Type</h2>
                <div className="segmented-control">
                    {['regular', 'detox'].map(type => (
                        <button
                            key={type}
                            className={dietType === type ? 'segment-active' : 'segment'}
                            onClick={() => handleDietTypeChange(type)}
                        >
                            {type === 'regular' ? 'Regular Diet' : 'Detox Diet'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Data Loading and Error States */}
            {loading ? (
                <p className="loading-text">Loading diet history...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : (
                <div className="diet-history-container">
                    <h3 className="diet-history-heading">
                        {dietType === 'regular' ? 'Regular Diet' : 'Detox Diet'} History
                    </h3>

                    <table className="weight-history-table">
                        <thead>
                            <tr>
                                <th scope="col">Week</th>
                                <th scope="col">Date</th>
                                {dietType === 'regular' && <th scope="col">Weight (kg)</th>}
                                <th scope="col">Actions</th>
                                <th scope="col">Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDietHistory.length > 0 ? (
                                filteredDietHistory.map((diet) => (
                                    <tr key={diet.id}>
                                        <td>Week {diet.week}</td>
                                        <td>{diet.date}</td>
                                        {dietType === 'regular' && <td>{diet.weight}</td>}
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    type="button"
                                                    className="action-button action-use"
                                                    onClick={() => handleDietAction('use', diet.id, dietType === 'regular' ? 0 : 1)}
                                                    aria-label={`use diet for week ${diet.week}`}
                                                >
                                                    Use
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-button action-view"
                                                    onClick={() => handleDietAction('view', diet.id, dietType === 'regular' ? 0 : 1)}
                                                    aria-label={`view diet for week ${diet.week}`}
                                                >
                                                    View
                                                </button>
                                                {(dietType === 'regular' && diet.id === latestRegularDietId) || 
                                                 (dietType === 'detox' && diet.id === latestDetoxDietId) ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="action-button action-edit"
                                                            onClick={() => handleDietAction('edit', diet.id, dietType === 'regular' ? 0 : 1)}
                                                            aria-label={`edit diet for week ${diet.week}`}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="action-button action-delete"
                                                            onClick={() => handleDeleteDiet(diet.id)}
                                                            aria-label={`delete diet for week ${diet.week}`}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td>{diet.feedback}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={dietType === 'regular' ? 5 : 4} className="no-data">
                                        No {dietType} diet history available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DietHistoryTable;