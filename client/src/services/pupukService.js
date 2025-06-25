// client/src/services/pupukService.js
import api from './api'; // Import instance axios yang terkonfigurasi

export const getPupuks = async () => {
  try {
    const response = await api.get('/pupuk');
    return response.data;
  } catch (error) {
    console.error("Error fetching pupuks:", error);
    throw error;
  }
};

export const createPupuk = async (pupukData) => {
  try {
    const response = await api.post('/pupuk', pupukData);
    return response.data;
  } catch (error) {
    console.error("Error creating pupuk:", error);
    throw error;
  }
};

export const updatePupuk = async (id, pupukData) => {
  try {
    const response = await api.put(`/pupuk/${id}`, pupukData);
    return response.data;
  } catch (error) {
    console.error("Error updating pupuk:", error);
    throw error;
  }
};

export const deletePupuk = async (id) => {
  try {
    const response = await api.delete(`/pupuk/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pupuk:", error);
    throw error;
  }
};