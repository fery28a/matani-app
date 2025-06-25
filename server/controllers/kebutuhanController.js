// server/controllers/kebutuhanController.js
const Kebutuhan = require('../models/Kebutuhan');
const mongoose = require('mongoose');

// @desc    Get all kebutuhan
// @route   GET /api/kebutuhan
// @access  Public
const getKebutuhans = async (req, res) => {
  try {
    const kebutuhans = await Kebutuhan.find({});
    res.status(200).json(kebutuhans);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kebutuhan', error: error.message });
  }
};

// @desc    Get single kebutuhan by ID
// @route   GET /api/kebutuhan/:id
// @access  Public
const getKebutuhanById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
    }
    const kebutuhan = await Kebutuhan.findById(req.params.id);
    if (!kebutuhan) {
      return res.status(404).json({ message: 'Kebutuhan tidak ditemukan' });
    }
    res.status(200).json(kebutuhan);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data kebutuhan', error: error.message });
  }
};

// @desc    Create new kebutuhan
// @route   POST /api/kebutuhan
// @access  Public
const createKebutuhan = async (req, res) => {
  const { nama, satuan, harga } = req.body;

  if (!nama || !satuan || !harga) {
    return res.status(400).json({ message: 'Semua kolom harus diisi' });
  }

  try {
    const kebutuhan = await Kebutuhan.create({ nama, satuan, harga });
    res.status(201).json(kebutuhan);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.nama) {
      return res.status(409).json({ message: 'Nama kebutuhan sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal menambahkan kebutuhan', error: error.message });
  }
};

// @desc    Update kebutuhan
// @route   PUT /api/kebutuhan/:id
// @access  Public
const updateKebutuhan = async (req, res) => {
  const { nama, satuan, harga } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
    }
    const kebutuhan = await Kebutuhan.findById(req.params.id);
    if (!kebutuhan) {
      return res.status(404).json({ message: 'Kebutuhan tidak ditemukan' });
    }

    kebutuhan.nama = nama !== undefined ? nama : kebutuhan.nama;
    kebutuhan.satuan = satuan !== undefined ? satuan : kebutuhan.satuan;
    kebutuhan.harga = harga !== undefined ? harga : kebutuhan.harga;

    await kebutuhan.save();
    res.status(200).json(kebutuhan);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.nama) {
      return res.status(409).json({ message: 'Nama kebutuhan sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal memperbarui kebutuhan', error: error.message });
  }
};

// @desc    Delete kebutuhan
// @route   DELETE /api/kebutuhan/:id
// @access  Public
const deleteKebutuhan = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
    }
    const result = await Kebutuhan.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Kebutuhan tidak ditemukan' });
    }
    res.status(200).json({ message: 'Kebutuhan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus kebutuhan', error: error.message });
  }
};

module.exports = {
  getKebutuhans,
  getKebutuhanById,
  createKebutuhan,
  updateKebutuhan,
  deleteKebutuhan,
};