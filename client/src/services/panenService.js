// client/src/services/panenService.js
import api from './api'; // Import instance axios yang terkonfigurasi

const BASE_URL = '/kegiatan/panen'; // Path khusus untuk kegiatan

export const getPanens = async (lahanId = null) => {
  try {
    const config = {
      params: {}
    };
    if (lahanId) {
      config.params.lahanId = lahanId;
    }
    const response = await api.get(BASE_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching panens:", error);
    throw error;
  }
};

export const createPanen = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating panen:", error);
    throw error;
  }
};

export const updatePanen = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating panen:", error);
    throw error;
  }
};

export const deletePanen = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting panen:", error);
    throw error;
  }
};