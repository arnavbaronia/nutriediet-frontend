export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const setUserId = (userId) => {
  localStorage.setItem('userId', userId);
};

export const getUserId = () => {
  return localStorage.getItem('userId');
};

export const setuser_type = (user_type) => {
  localStorage.setItem('user_type', user_type);
};

export const getuser_type = () => {
  return localStorage.getItem('user_type');
};