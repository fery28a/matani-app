// client/src/services/penanamanService.js
import api from './api'; // Import instance axios yang terkonfigurasi

const BASE_URL = '/kegiatan/penanaman'; // Path khusus untuk kegiatan

export const getPenanamans = async (lahanId = null) => {
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
    console.error("Error fetching penanamans:", error);
    throw error;
  }
};

export const createPenanaman = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating penanaman:", error);
    throw error;
  }
};

export const updatePenanaman = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating penanaman:", error);
    throw error;
  }
};

export const deletePenanaman = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting penanaman:", error);
    throw error;
  }
};