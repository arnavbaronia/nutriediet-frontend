import React from 'react';
import '../../styles/AccountActivationPage.css';

const AccountActivationPage = () => {
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
