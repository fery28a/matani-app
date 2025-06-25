// client/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users/';

export const login = async (username, password) => {
  const response = await axios.post(API_URL + 'login', { username, password });

  // Pastikan token disimpan di localStorage
  if (response.data.token) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};