import axios from 'axios';
import { getToken } from './token';
import { API_BASE_URL } from '../utils/constants';
import logger from '../utils/logger';

export const fetchDiet = async (clientId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/${clientId}/diet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Error fetching diet', error);
    throw error;
  }
};