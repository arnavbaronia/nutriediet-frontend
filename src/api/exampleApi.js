import api from './axiosInstance';

const getUserData = async () => {
  try {
    const response = await api.get('/user');
    console.log('User data:', response.data);
  } catch (error) {
    console.error('Error fetching user data:', error.response || error.message);
  }
};

getUserData();
