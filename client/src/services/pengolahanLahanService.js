// client/src/services/pengolahanLahanService.js
import api from './api'; // Import instance axios yang terkonfigurasi

const BASE_URL = '/kegiatan/pengolahan-lahan'; // Path khusus untuk kegiatan

export const getPengolahanLahans = async (lahanId = null) => { // Tambahkan lahanId sebagai parameter opsional
  try {
    const config = {
      params: {} // Inisialisasi object params
    };
    if (lahanId) {
      config.params.lahanId = lahanId; // Tambahkan lahanId jika ada
    }
    // Karena kita menggunakan Axios, response backend formatnya {data: [...], totalKeseluruhanBiaya: ...}
    // Maka, kita akan mengembalikan seluruh objek response.data
    const response = await api.get(BASE_URL, config);
    return response.data; // Mengembalikan objek { data: [...], totalKeseluruhanBiaya: ... }
  } catch (error) {
    console.error("Error fetching pengolahan lahans:", error);
    throw error;
  }
};

export const createPengolahanLahan = async (data) => {
  try {
    const response = await api.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating pengolahan lahan:", error);
    throw error;
  }
};

export const updatePengolahanLahan = async (id, data) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating pengolahan lahan:", error);
    throw error;
  }
};

export const deletePengolahanLahan = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting pengolahan lahan:", error);
    throw error;
  }
};