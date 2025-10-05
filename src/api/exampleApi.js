import api from './axiosInstance';
import logger from '../utils/logger';

const getUserData = async () => {
  try {
    const response = await api.get('/user');
    logger.info('User data', response.data);
    return response.data;
  } catch (error) {
    logger.error('Error fetching user data', error);
    throw error;
  }
};

export default getUserData;
