import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/ClientDetailsPage.css';

const DietHistoryTable = ({ 
  clientId, 
  dietHistory = [], 
  handleDietAction, 
  handleDelete 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dietToDelete, setDietToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatHistoryData = (history) => {
    return (history || [])
      .map(diet => ({
        id: diet.id,
        week: diet.week_number,
        date: formatDate(diet.date),
        dietString: diet.diet_string,
        weight: diet.weight || '-',
        templateName: diet.name || 'Custom Template',
        feedback: diet.feedback || '-'
      }))
      .sort((a, b) => b.week - a.week); 
  };

  const formattedHistory = formatHistoryData(dietHistory);

  const latestDietId = formattedHistory.length > 0 
    ? formattedHistory[0].id 
    : null;

  const confirmDelete = (dietId) => {
    setDietToDelete(dietId);
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    if (!dietToDelete) return;
    
    setDeleting(true);
    
    try {
      await handleDelete(dietToDelete);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting diet:", error);
    } finally {
      setDeleting(false);
      setDietToDelete(null);
    }
  };

  return (
    <div className="diet-history-wrapper">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this diet record?</p>
            <div className="modal-buttons">
              <button 
                className="modal-button modal-cancel"
                onClick={() => setShowDeleteModal(false)}
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

      {/* Main History Table */}
      <div className="diet-history-container">
        <h3 className="diet-history-heading">Regular Diet History</h3>

        <table className="weight-history-table">
          <thead>
            <tr>
              <th>Week</th>
              <th>Date</th>
              <th>Weight</th>
              <th>Diet Template</th>
              <th>Actions</th>
              <th>Feedback</th>
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
                        className="action-button action-use"
                        onClick={() => handleDietAction('use', diet.id)}
                      >
                        View
                      </button>
                      <button
                        className="action-button action-view"
                        onClick={() => handleDietAction('view', diet.id)}
                      >
                        Refer
                      </button>
                      {diet.id === latestDietId && (
                        <>
                          <button
                            className="action-button action-edit"
                            onClick={() => handleDietAction('edit', diet.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-button action-delete"
                            onClick={() => confirmDelete(diet.id)}
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
    </div>
  );
};

export default DietHistoryTable;