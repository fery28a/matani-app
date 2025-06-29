// client/src/services/api.js
import axios from 'axios';
// Hapus import { getUserInfo } from './authService';
// import { getUserInfo } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Atau alamat IP VPS Anda jika sudah diubah
});

// Hapus interceptor permintaan ini sepenuhnya
// api.interceptors.request.use(
//   (config) => {
//     const userInfo = getUserInfo();
//     if (userInfo && userInfo.token) {
//       config.headers.Authorization = `Bearer ${userInfo.token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Hapus interceptor respons ini sepenuhnya
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.log('Token tidak valid atau kedaluwarsa. Melakukan logout otomatis.');
//       localStorage.removeItem('userInfo');
//     }
//     return Promise.reject(error);
//   }
// );

export default api;