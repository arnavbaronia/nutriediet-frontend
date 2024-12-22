import axios from 'axios';
import { setToken, setUserId, setUserType } from './token'; 

const BASE_URL = 'http://localhost:8081';

/**
 * Handles user signup
 * @param {Object} formData - The data required for user signup.
 * @returns {Object} - The token, clientId, and userType from the server response.
 * @throws {Error} - Throws an error if the server response is invalid or the request fails.
 */
export const signup = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, formData);

    const { created } = response.data || {};
    const token = created?.token;
    const clientId = created?.id; 
    const userType = created?.user_type;

    if (!token || !clientId || !userType) {
      throw new Error('Missing token, clientId, or userType in server response.');
    }

    setToken(token);
    setUserId(clientId);
    setUserType(userType);

    return { token, clientId, userType };
  } catch (error) {
    const serverError = error.response?.data?.err || error.message || 'Signup failed.';
    console.error('Signup error:', serverError);
    throw new Error(serverError);
  }
};

/**
 * Handles user login
 * @param {Object} credentials - The email, password, and userType for login.
 * @returns {Object} - The token, clientId, and userType from the server response.
 * @throws {Error} - Throws an error if the server response is invalid or the request fails.
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials);

    const { token, id: clientId, userType } = response.data || {};

    if (!token || !clientId || !userType) {
      throw new Error('Missing token, clientId, or userType in server response.');
    }

    setToken(token);
    setUserId(clientId);
    setUserType(userType);

    return { token, clientId, userType };
  } catch (error) {
    const serverError = error.response?.data?.err || error.message || 'Login failed.';
    console.error('Login error:', serverError);
    throw new Error(serverError);
  }
};
