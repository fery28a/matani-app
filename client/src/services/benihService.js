// client/src/services/benihService.js
import api from './api'; // Import instance axios yang terkonfigurasi

// Hapus const API_URL = 'http://localhost:5001/api/benih'; karena sudah diatur di api.js

export const getBenihs = async () => {
  try {
    const response = await api.get('/benih'); // Menggunakan api.get()
    return response.data;
  } catch (error) {
    console.error("Error fetching benihs:", error);
    throw error;
  }
};

export const createBenih = async (benihData) => {
  try {
    const response = await api.post('/benih', benihData); // Menggunakan api.post()
    return response.data;
  } catch (error) {
    console.error("Error creating benih:", error);
    throw error;
  }
};

export const updateBenih = async (id, benihData) => {
  try {
    const response = await api.put(`/benih/${id}`, benihData); // Menggunakan api.put()
    return response.data;
  } catch (error) {
    console.error("Error updating benih:", error);
    throw error;
  }
};

export const deleteBenih = async (id) => {
  try {
    const response = await api.delete(`/benih/${id}`); // Menggunakan api.delete()
    return response.data;
  } catch (error) {
    console.error("Error deleting benih:", error);
    throw error;
  }
};