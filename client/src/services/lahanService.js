// client/src/services/lahanService.js
import api from './api'; // <--- UBAH: Import instance axios yang terkonfigurasi

// Hapus const API_URL karena sudah ada di api.js
// const API_URL = 'http://localhost:5001/api/lahan';

export const getLahans = async () => {
  try {
    const response = await api.get('/lahan'); // <--- UBAH: Gunakan api.get()
    return response.data;
  } catch (error) {
    console.error("Error fetching lahans:", error);
    throw error;
  }
};

export const createLahan = async (lahanData) => {
  try {
    const response = await api.post('/lahan', lahanData); // <--- UBAH: Gunakan api.post()
    return response.data;
  } catch (error) {
    console.error("Error creating lahan:", error);
    throw error;
  }
};

export const updateLahan = async (id, lahanData) => {
  try {
    const response = await api.put(`/lahan/${id}`, lahanData); // <--- UBAH: Gunakan api.put()
    return response.data;
  } catch (error) {
    console.error("Error updating lahan:", error);
    throw error;
  }
};

export const deleteLahan = async (id) => {
  try {
    const response = await api.delete(`/lahan/${id}`); // <--- UBAH: Gunakan api.delete()
    return response.data;
  } catch (error) {
    console.error("Error deleting lahan:", error);
    throw error;
  }
};

export const resetLahan = async (id) => {
  try {
    const response = await api.delete(`/lahan/${id}/reset`); // <--- UBAH: Gunakan api.delete()
    return response.data;
  } catch (error) {
    console.error("Error resetting lahan:", error);
    throw error;
  }
};