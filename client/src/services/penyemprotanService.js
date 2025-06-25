// client/src/services/penyemprotanService.js
import api from './api'; // Import instance axios yang terkonfigurasi

const BASE_URL = '/kegiatan/penyemprotan'; // Path khusus untuk kegiatan

export const getPenyemprotans = async (lahanId = null) => {
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
    console.error("Error fetching penyemprotans:", error);
    throw error;
  }
};

export const createPenyemprotan = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating penyemprotan:", error);
    throw error;
  }
};

export const updatePenyemprotan = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  }
  catch (error) {
    console.error("Error updating penyemprotan:", error);
    throw error;
  }
};

export const deletePenyemprotan = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting penyemprotan:", error);
    throw error;
  }
};