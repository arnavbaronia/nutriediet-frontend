import axios from 'axios';
import { getToken } from './token';

const BASE_URL = 'http://localhost:8081';

export const fetchDiet = async (clientId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/${clientId}/diet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching diet:', error.response || error.message);
    throw error;
  }
};