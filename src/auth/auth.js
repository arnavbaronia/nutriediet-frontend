import axios from 'axios';
import { setToken, setUserId, setuser_type } from './token';
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';
import logger from '../utils/logger';

/**
 * Handles user signup
 * @param {Object} formData - The data required for user signup.
 * @returns {Object} - The token, clientId, and user_type from the server response.
 * @throws {Error} - Throws an error if the server response is invalid or the request fails.
 */
export const signup = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, formData);

    const { created } = response.data || {};
    const token = created?.token;
    const clientId = created?.id; 
    const user_type = created?.user_type;

    if (!token || !clientId || !user_type) {
      throw new Error('Missing token, clientId, or user_type in server response.');
    }

    setToken(token);
    setUserId(clientId);
    setuser_type(user_type);

    return { token, clientId, user_type };
  } catch (error) {
    const serverError = error.response?.data?.err || error.message || 'Signup failed.';
    logger.error('Signup error', error);
    throw new Error(serverError);
  }
};

/**
 * Handles user login
 * @param {Object} credentials - The email, password, and user_type for login.
 * @returns {Object} - The token, clientId, and user_type from the server response.
 * @throws {Error} - Throws an error if the server response is invalid or the request fails.
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, credentials);

    const { token, id: clientId, user_type } = response.data || {};

    if (!token || !clientId || !user_type) {
      throw new Error('Missing token, clientId, or user_type in server response.');
    }

    setToken(token);
    setUserId(clientId);
    setuser_type(user_type);

    return { token, clientId, user_type };
  } catch (error) {
    const serverError = error.response?.data?.err || error.message || 'Login failed.';
    logger.error('Login error', error);
    throw new Error(serverError);
  }
};