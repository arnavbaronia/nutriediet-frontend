import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/AccountActivationPage.css';

const AccountActivationPage = () => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkActivationStatus = async () => {
      try {
        const clientId = localStorage.getItem('client_id');
        const token = localStorage.getItem('token');
        
        if (!clientId || !token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(
          `https://nutriediet-go.onrender.com/clients/${clientId}/profile_created`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const { profile_created, is_active } = response.data;

        if (profile_created && is_active) {
          navigate(`/clients/${clientId}/diet`);
        }
      } catch (error) {
        console.error('Error checking activation status:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkActivationStatus();
  }, [navigate]); 

  if (isChecking) {
    return (
      <div className="page-container">
        <div className="account-activation-container">
          <h2 className="account-activation-heading">Checking account status...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="account-activation-container">
        <h2 className="account-activation-heading">Account Needs Activation</h2>
        <p className="account-activation-text">
          Please contact your dietitian to activate your account.
        </p>
      </div>
    </div>
  );
};

export default AccountActivationPage;