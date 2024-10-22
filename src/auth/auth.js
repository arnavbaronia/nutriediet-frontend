import axios from 'axios';
import { setToken, getToken, removeToken } from './token';

const BASE_URL = 'http://localhost:8081';

export const signup = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, formData);
    const token = response.data.created.Token; 
    setToken(token);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response || error.message);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { ...credentials, userType: 'ADMIN' });
    const token = response.data.token; 
    setToken(token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response || error.message);
    throw error;
  }
};

export const logout = () => {
  removeToken();
};
