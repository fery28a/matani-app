// client/src/services/pestisidaService.js
import api from './api'; // Import instance axios yang terkonfigurasi

export const getPestisidas = async () => {
  try {
    const response = await api.get('/pestisida');
    return response.data;
  } catch (error) {
    console.error("Error fetching pestisidas:", error);
    throw error;
  }
};

export const createPestisida = async (pestisidaData) => {
  try {
    const response = await api.post('/pestisida', pestisidaData);
    return response.data;
  } catch (error) {
    console.error("Error creating pestisida:", error);
    throw error;
  }
};

export const updatePestisida = async (id, pestisidaData) => {
  try {
    const response = await api.put(`/pestisida/${id}`, pestisidaData);
    return response.data;
  } catch (error) {
    console.error("Error updating pestisida:", error);
    throw error;
  }
};

export const deletePestisida = async (id) => {
  try {
    const response = await api.delete(`/pestisida/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pestisida:", error);
    throw error;
  }
};