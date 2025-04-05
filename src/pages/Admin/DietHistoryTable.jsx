import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ClientDetailsPage.css';

const DietHistoryTable = ({ 
    clientId, 
    handleDietAction, 
    handleDelete, 
    dietHistory: propsDietHistory, 
    onDietHistoryChange,
    refreshTrigger 
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [dietToDelete, setDietToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [formattedHistory, setFormattedHistory] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatHistoryData = (history) => {
        return history.map(diet => ({
            id: diet.id,
            week: diet.week_number,
            date: formatDate(diet.date),
            dietString: diet.diet_string,
            weight: diet.weight || '-',
            templateName: diet.name || 'Custom Template',
            feedback: diet.feedback || '-'
        })).sort((a, b) => b.week - a.week);
    };

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
                `https://nutriediet-go.onrender.com/admin/client/${clientId}/diet_history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const regularHistory = response.data.diet_history_regular || [];
            const formattedData = formatHistoryData(regularHistory);
            
            setFormattedHistory(formattedData);
            
            if (onDietHistoryChange) {
                onDietHistoryChange(formattedData);
            }
        } catch (err) {
            setError('Failed to fetch diet history. Please try again.');
            console.error('Error fetching diet history:', err);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (dietId) => {
        setDietToDelete(dietId);
        setShowDeleteModal(true);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDietToDelete(null);
    };

    const executeDelete = async () => {
        setShowDeleteModal(false);
        setDeleting(true);
        
        try {
            await handleDelete(dietToDelete);
        } catch (error) {
            console.error("Error deleting diet:", error);
            setError("Failed to delete diet.");
        } finally {
            setDeleting(false);
            setDietToDelete(null);
        }
    };

    useEffect(() => {
        if (clientId) {
            fetchDietHistory();
        }
    }, [clientId, refreshTrigger]);

    useEffect(() => {
        if (propsDietHistory && propsDietHistory.length > 0) {
            const formattedData = formatHistoryData(propsDietHistory);
            setFormattedHistory(formattedData);
        }
    }, [propsDietHistory]);

    const latestDietId = formattedHistory.length > 0 ? formattedHistory[0].id : null;

    return (
        <div className="diet-history-wrapper">
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="delete-modal">
                        <h3>Confirm Deletion</h3>
                        <p>Are you sure you want to delete this diet record? This action cannot be undone.</p>
                        <div className="modal-buttons">
                            <button 
                                className="modal-button modal-cancel"
                                onClick={cancelDelete}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button 
                                className="modal-button modal-confirm"
                                onClick={executeDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Loading and Error States */}
            {loading ? (
                <p className="loading-text">Loading diet history...</p>
            ) : error ? (
                <p className="error-text">{error}</p>
            ) : (
                <div className="diet-history-container">
                    <h3 className="diet-history-heading">Regular Diet History</h3>

                    <table className="weight-history-table">
                        <thead>
                            <tr>
                                <th scope="col">Week</th>
                                <th scope="col">Date</th>
                                <th scope="col">Weight</th>
                                <th scope="col">Diet Template</th>
                                <th scope="col">Actions</th>
                                <th scope="col">Feedback</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formattedHistory.length > 0 ? (
                                formattedHistory.map((diet) => (
                                    <tr key={diet.id}>
                                        <td>Week {diet.week}</td>
                                        <td>{diet.date}</td>
                                        <td>{diet.weight}</td>
                                        <td>{diet.templateName}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    type="button"
                                                    className="action-button action-use"
                                                    onClick={() => handleDietAction('use', diet.id)}
                                                    aria-label={`use diet for week ${diet.week}`}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-button action-view"
                                                    onClick={() => handleDietAction('view', diet.id)}
                                                    aria-label={`view diet for week ${diet.week}`}
                                                >
                                                    Refer
                                                </button>
                                                {diet.id === latestDietId && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="action-button action-edit"
                                                            onClick={() => handleDietAction('edit', diet.id)}
                                                            aria-label={`edit diet for week ${diet.week}`}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="action-button action-delete"
                                                            onClick={() => confirmDelete(diet.id)}
                                                            aria-label={`delete diet for week ${diet.week}`}
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="feedback-column">{diet.feedback}</td> 
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="no-data">
                                        No diet history available.
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