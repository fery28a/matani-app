// client/src/services/perawatanTanamanService.js
import api from './api'; // Import instance axios yang terkonfigurasi

const BASE_URL = '/kegiatan/perawatan-tanaman'; // Path khusus untuk kegiatan

export const getPerawatanTanamans = async (lahanId = null) => {
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
    console.error("Error fetching perawatan tanamans:", error);
    throw error;
  }
};

export const createPerawatanTanaman = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating perawatan tanaman:", error);
    throw error;
  }
};

export const updatePerawatanTanaman = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating perawatan tanaman:", error);
    throw error;
  }
};

export const deletePerawatanTanaman = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting perawatan tanaman:", error);
    throw error;
  }
};