import apiClient from './apiClient';

const authAPI = {
  register: (userData) => apiClient.post('/users/register', userData),
  login: (credentials) => apiClient.post('/users/login', credentials),
};

export default authAPI;
