// server/controllers/benihController.js
const Benih = require('../models/Benih');
const mongoose = require('mongoose');

// @desc    Get all benih
// @route   GET /api/benih
// @access  Public
const getBenihs = async (req, res) => {
  try {
    const benihs = await Benih.find({});
    res.status(200).json(benihs);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data benih', error: error.message });
  }
};

// @desc    Get single benih by ID
// @route   GET /api/benih/:id
// @access  Public
const getBenihById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Benih tidak valid' });
    }
    const benih = await Benih.findById(req.params.id);
    if (!benih) {
      return res.status(404).json({ message: 'Benih tidak ditemukan' });
    }
    res.status(200).json(benih);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data benih', error: error.message });
  }
};

// @desc    Create new benih
// @route   POST /api/benih
// @access  Public
const createBenih = async (req, res) => {
  const { nama, jenis, satuan, harga } = req.body;

  if (!nama || !jenis || !satuan || !harga) {
    return res.status(400).json({ message: 'Semua kolom harus diisi' });
  }

  try {
    const benih = await Benih.create({ nama, jenis, satuan, harga });
    res.status(201).json(benih);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.nama) {
      return res.status(409).json({ message: 'Nama benih sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal menambahkan benih', error: error.message });
  }
};

// @desc    Update benih
// @route   PUT /api/benih/:id
// @access  Public
const updateBenih = async (req, res) => {
  const { nama, jenis, satuan, harga } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Benih tidak valid' });
    }
    const benih = await Benih.findById(req.params.id);
    if (!benih) {
      return res.status(404).json({ message: 'Benih tidak ditemukan' });
    }

    benih.nama = nama !== undefined ? nama : benih.nama;
    benih.jenis = jenis !== undefined ? jenis : benih.jenis;
    benih.satuan = satuan !== undefined ? satuan : benih.satuan;
    benih.harga = harga !== undefined ? harga : benih.harga;

    await benih.save();
    res.status(200).json(benih);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.nama) {
      return res.status(409).json({ message: 'Nama benih sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal memperbarui benih', error: error.message });
  }
};

// @desc    Delete benih
// @route   DELETE /api/benih/:id
// @access  Public
const deleteBenih = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Benih tidak valid' });
    }
    const result = await Benih.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Benih tidak ditemukan' });
    }
    res.status(200).json({ message: 'Benih berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus benih', error: error.message });
  }
};

module.exports = {
  getBenihs,
  getBenihById,
  createBenih,
  updateBenih,
  deleteBenih,
};