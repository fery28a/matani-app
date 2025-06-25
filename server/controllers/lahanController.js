const Lahan = require('../models/Lahan');
const mongoose = require('mongoose');

// Import semua model kegiatan yang akan terpengaruh oleh reset lahan
const PengolahanLahan = require('../models/PengolahanLahan');
const Penanaman = require('../models/Penanaman');
const PerawatanTanaman = require('../models/PerawatanTanaman');
const Penyemprotan = require('../models/Penyemprotan');
const Panen = require('../models/Panen');


// Helper function to check if ID is valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all lahans
// @route   GET /api/lahan
// @access  Public
const getLahans = async (req, res) => {
  try {
    const lahans = await Lahan.find({});
    res.status(200).json(lahans);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data lahan', error: error.message });
  }
};

// @desc    Get single lahan by ID
// @route   GET /api/lahan/:id
// @access  Public
const getLahanById = async (req, res) => {
  try {
    // Validasi ID MongoDB yang valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Lahan tidak valid' });
    }

    const lahan = await Lahan.findById(req.params.id);
    if (!lahan) {
      return res.status(404).json({ message: 'Lahan tidak ditemukan' });
    }
    res.status(200).json(lahan);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data lahan', error: error.message });
  }
};

// @desc    Create new lahan
// @route   POST /api/lahan
// @access  Public
const createLahan = async (req, res) => {
  const { nama, luas } = req.body;

  if (!nama || !luas) {
    return res.status(400).json({ message: 'Nama dan luas lahan harus diisi' });
  }

  try {
    const lahan = await Lahan.create({ nama, luas });
    res.status(201).json(lahan);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.nama) {
      return res.status(409).json({ message: 'Nama lahan sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal menambahkan lahan', error: error.message });
  }
};

// @desc    Update lahan
// @route   PUT /api/lahan/:id
// @access  Public
const updateLahan = async (req, res) => {
  const { nama, luas } = req.body;

  try {
    // Validasi ID MongoDB yang valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Lahan tidak valid' });
    }

    const lahan = await Lahan.findById(req.params.id);
    if (!lahan) {
      return res.status(404).json({ message: 'Lahan tidak ditemukan' });
    }

    // Perbarui data
    lahan.nama = nama !== undefined ? nama : lahan.nama;
    lahan.luas = luas !== undefined ? luas : lahan.luas;

    await lahan.save();
    res.status(200).json(lahan);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.nama) {
      return res.status(409).json({ message: 'Nama lahan sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal memperbarui lahan', error: error.message });
  }
};

// @desc    Delete lahan
// @route   DELETE /api/lahan/:id
// @access  Public
const deleteLahan = async (req, res) => {
  try {
    // Validasi ID MongoDB yang valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Lahan tidak valid' });
    }

    const result = await Lahan.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Lahan tidak ditemukan' });
    }

    res.status(200).json({ message: 'Lahan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus lahan', error: error.message });
  }
};


// @desc    Delete lahan and all related activities
// @route   DELETE /api/lahan/:id/reset
// @access  Public
const resetLahanData = async (req, res) => {
  try {
    const { id } = req.params; // ID Lahan yang akan direset

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'ID Lahan tidak valid.' });
    }

    const lahan = await Lahan.findById(id);
    if (!lahan) {
      return res.status(404).json({ message: 'Lahan tidak ditemukan untuk direset.' });
    }

    // --- LOGIKA PENGHAPUSAN SEMUA DATA TERKAIT ---
    console.log(`Mulai reset data untuk Lahan ID: ${id} (${lahan.nama})...`);

    // Hapus semua kegiatan Pengolahan Lahan yang terkait dengan lahan ini
    const deletedPengolahanCount = await PengolahanLahan.deleteMany({ lahan: id });
    console.log(`Dihapus ${deletedPengolahanCount.deletedCount} data Pengolahan Lahan terkait.`);

    // Hapus semua kegiatan Penanaman yang terkait dengan lahan ini
    const deletedPenanamanCount = await Penanaman.deleteMany({ lahan: id });
    console.log(`Dihapus ${deletedPenanamanCount.deletedCount} data Penanaman terkait.`);

    // Hapus semua kegiatan Perawatan Tanaman yang terkait dengan lahan ini
    const deletedPerawatanCount = await PerawatanTanaman.deleteMany({ lahan: id });
    console.log(`Dihapus ${deletedPerawatanCount.deletedCount} data Perawatan Tanaman terkait.`);

    // Hapus semua kegiatan Penyemprotan yang terkait dengan lahan ini
    const deletedPenyemprotanCount = await Penyemprotan.deleteMany({ lahan: id });
    console.log(`Dihapus ${deletedPenyemprotanCount.deletedCount} data Penyemprotan terkait.`);

    // Hapus semua kegiatan Panen yang terkait dengan lahan ini
    const deletedPanenCount = await Panen.deleteMany({ lahan: id });
    console.log(`Dihapus ${deletedPanenCount.deletedCount} data Panen terkait.`);

    // Terakhir, hapus dokumen Lahan itu sendiri
    await lahan.deleteOne(); // Gunakan deleteOne() pada instance dokumen
    console.log(`Lahan (${lahan.nama}) berhasil dihapus.`);

    res.status(200).json({ message: `Lahan ${lahan.nama} dan semua kegiatan terkaitnya berhasil direset.` });

  } catch (error) {
    console.error('Error in resetLahanData:', error);
    res.status(500).json({ message: 'Gagal mereset data lahan dan kegiatan terkait.', error: error.message });
  }
};

module.exports = {
  getLahans,
  getLahanById,
  createLahan,
  updateLahan,
  deleteLahan,
  resetLahanData,
};