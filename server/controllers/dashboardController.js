// server/controllers/dashboardController.js
const Lahan = require('../models/Lahan');
const PengolahanLahan = require('../models/PengolahanLahan');
const Penanaman = require('../models/Penanaman');
const PerawatanTanaman = require('../models/PerawatanTanaman');
const Penyemprotan = require('../models/Penyemprotan');
const Panen = require('../models/Panen');
const mongoose = require('mongoose');

// @desc    Get latest spray history
// @route   GET /api/dashboard/latest-spray
// @access  Protected
const getLatestSprayHistory = async (req, res) => {
  try {
    const latestSprays = await Penyemprotan.find({})
      .sort({ tanggal: -1 })
      .limit(5)
      .populate('lahan', 'nama')
      .select('tanggal deskripsi totalBiaya');

    console.log("Dashboard API: Fetched latest sprays count:", latestSprays.length);
    res.status(200).json(latestSprays);
  } catch (error) {
    console.error('Dashboard API Error: getLatestSprayHistory:', error);
    res.status(500).json({ message: 'Gagal mengambil riwayat penyemprotan terbaru', error: error.message });
  }
};

// @desc    Get total costs aggregated by lahan
// @route   GET /api/dashboard/total-costs-per-lahan
// @access  Protected
const getTotalCostsPerLahan = async (req, res) => {
  try {
    const activityModels = [
      { model: PengolahanLahan, name: 'PengolahanLahan' },
      { model: Penanaman, name: 'Penanaman' },
      { model: PerawatanTanaman, name: 'PerawatanTanaman' },
      { model: Penyemprotan, name: 'Penyemprotan' },
      { model: Panen, name: 'Panen' },
    ];

    let aggregatedCostsMap = new Map();

    for (const activity of activityModels) {
      const Model = activity.model;
      const modelName = activity.name;

      const costs = await Model.aggregate([
        {
          $group: {
            _id: '$lahan',
            total: { $sum: '$totalBiaya' }
          }
        }
      ]);
      console.log(`Dashboard API: Aggregated ${modelName} costs:`, costs);

      for (const cost of costs) {
        const lahanId = cost._id.toString();
        const currentData = aggregatedCostsMap.get(lahanId) || {
            lahan: cost._id,
            totalBiayaSemuaKegiatan: 0
        };
        currentData.totalBiayaSemuaKegiatan += cost.total;
        aggregatedCostsMap.set(lahanId, currentData);
      }
    }

    let result = Array.from(aggregatedCostsMap.values());
    console.log("Dashboard API: Intermediate aggregated costs before population:", result);

    const populatedResult = await Promise.all(result.map(async (item) => {
      const lahanObjectId = mongoose.Types.ObjectId.isValid(item.lahan) ? new mongoose.Types.ObjectId(item.lahan) : null;
      if (!lahanObjectId) {
          console.warn(`Dashboard API: Invalid Lahan ID found in aggregation for item:`, item);
          return null;
      }
      const lahanDoc = await Lahan.findById(lahanObjectId).select('nama luas');
      return {
        lahan: lahanDoc ? { _id: lahanDoc._id, nama: lahanDoc.nama, luas: lahanDoc.luas } : null,
        totalBiayaSemuaKegiatan: item.totalBiayaSemuaKegiatan
      };
    }));

    const finalResult = populatedResult.filter(item => item !== null && item.lahan !== null);
    console.log("Dashboard API: Final total costs per lahan count:", finalResult.length);

    res.status(200).json(finalResult);

  } catch (error) {
    console.error('Dashboard API Error: getTotalCostsPerLahan:', error);
    res.status(500).json({ message: 'Gagal mengambil total biaya per lahan', error: error.message });
  }
};

module.exports = {
  getLatestSprayHistory,
  getTotalCostsPerLahan,
};