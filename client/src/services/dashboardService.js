// client/src/services/dashboardService.js
import api from './api'; // Pastikan ini mengimpor instance axios yang terkonfigurasi dengan benar

export const getLatestSprayHistory = async () => {
  try {
    const response = await api.get('/dashboard/latest-spray');
    return response.data;
  } catch (error) {
    console.error("Error fetching latest spray history:", error);
    throw error;
  }
};

export const getTotalCostsPerLahan = async () => {
  try {
    const response = await api.get('/dashboard/total-costs-per-lahan');
    return response.data;
  } catch (error) {
    console.error("Error fetching total costs per lahan:", error);
    throw error;
  }
};