import React, { useState } from 'react';
import api from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../../styles/AccountActivationPage.css';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const AccountActivationPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    loading: false,
    isActive: false,
    error: null
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const checkActivationStatus = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      const clientId = localStorage.getItem('client_id');
      const token = localStorage.getItem('token');
      
      if (!clientId || !token) {
        localStorage.clear();
        navigate('/login');
        return;
      }

      const response = await api.get(`/clients/${clientId}/profile_created`
      );

      setStatus({
        loading: false,
        isActive: response.data.is_active,
        error: null
      });

    } catch (error) {
      setStatus({
        loading: false,
        isActive: false,
        error: error.response?.data?.error || error.message
      });

      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="activation-page-container">
      <div className="activation-status-container">
        <h2 className="activation-heading">Account Activation Status</h2>
        
        <div className="activation-content">
          {status.isActive ? (
            <>
              <p className="activation-text success-message">
                ✅ Your account has been activated!
              </p>
              <p className="activation-text instruction">
                Please logout and login again to access all features.
              </p>
              <button 
                className="activation-logout-btn"
                onClick={() => setShowLogoutModal(true)}
              >
                <ExitToAppIcon className="logout-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <p className="activation-text">
                {status.loading 
                  ? 'Checking status...' 
                  : status.error 
                    ? `Error: ${status.error}`
                    : 'Account pending activation by dietitian'
                }
              </p>
              <button 
                className="activation-check-btn"
                onClick={checkActivationStatus}
                disabled={status.loading}
              >
                {status.loading ? 'Checking...' : 'Check Status'}
              </button>
            </>
          )}
        </div>
      </div>

      {showLogoutModal && (
        <div className="activation-modal-overlay">
          <div className="activation-modal-content">
            <h2>Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="activation-modal-buttons">
              <button 
                className="activation-confirm-btn"
                onClick={handleLogout}
              >
                Confirm
              </button>
              <button 
                className="activation-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountActivationPage;