// client/src/services/api.js
import axios from 'axios';
import { getUserInfo } from './authService'; // Import getUserInfo

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // URL dasar untuk semua API backend
});

// Tambahkan interceptor permintaan
api.interceptors.request.use(
  (config) => {
    const userInfo = getUserInfo(); // Ambil info user (termasuk token)
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`; // Tambahkan token ke header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tambahkan interceptor respons untuk logout otomatis jika 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Token tidak valid atau kedaluwarsa. Melakukan logout otomatis.');
      localStorage.removeItem('userInfo');
      // Tidak bisa navigate dari sini karena ini bukan komponen React.
      // Component yang menggunakan api ini perlu menangani 401 jika terjadi setelah login.
      // Di komponen React, Anda bisa melakukan: if (error.response && error.response.status === 401) navigate('/login');
    }
    return Promise.reject(error);
  }
);

export default api;