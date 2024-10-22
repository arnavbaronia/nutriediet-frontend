import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/login', { 
        email: "nutriedietplan@gmail.com", 
        password: "Flamingo@123", 
        user_type: 'ADMIN' 
      });
      const { token, userType } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      console.log('Token:', token);
      console.log('UserType:', userType);
      if (userType === 'ADMIN') {
        window.location.href = '/admin/dashboard'; // Redirect to admin dashboard
      } else {
        setError('Unauthorized access');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;
