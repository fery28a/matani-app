// client/src/services/kebutuhanService.js
import api from './api'; // Import instance axios yang terkonfigurasi

export const getKebutuhans = async () => {
  try {
    const response = await api.get('/kebutuhan');
    return response.data;
  } catch (error) {
    console.error("Error fetching kebutuhans:", error);
    throw error;
  }
};

export const createKebutuhan = async (kebutuhanData) => {
  try {
    const response = await api.post('/kebutuhan', kebutuhanData);
    return response.data;
  } catch (error) {
    console.error("Error creating kebutuhan:", error);
    throw error;
  }
};

export const updateKebutuhan = async (id, kebutuhanData) => {
  try {
    const response = await api.put(`/kebutuhan/${id}`, kebutuhanData);
    return response.data;
  } catch (error) {
    console.error("Error updating kebutuhan:", error);
    throw error;
  }
};

export const deleteKebutuhan = async (id) => {
  try {
    const response = await api.delete(`/kebutuhan/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting kebutuhan:", error);
    throw error;
  }
};