import axios from 'axios';
import { getToken } from './token';

const BASE_URL = 'https://nutriediet-go-production.up.railway.app';

export const fetchProfile = async (clientId) => {
  try {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/${clientId}/my_profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error.response || error.message);
    throw error;
  }
};