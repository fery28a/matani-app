// server/controllers/pupukController.js
const Pupuk = require('../models/Pupuk');
const mongoose = require('mongoose');

// @desc    Get all pupuk
// @route   GET /api/pupuk
// @access  Public
const getPupuks = async (req, res) => {
  try {
    const pupuks = await Pupuk.find({});
    res.status(200).json(pupuks);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pupuk', error: error.message });
  }
};

// @desc    Get single pupuk by ID
// @route   GET /api/pupuk/:id
// @access  Public
const getPupukById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Pupuk tidak valid' });
    }
    const pupuk = await Pupuk.findById(req.params.id);
    if (!pupuk) {
      return res.status(404).json({ message: 'Pupuk tidak ditemukan' });
    }
    res.status(200).json(pupuk);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pupuk', error: error.message });
  }
};

// @desc    Create new pupuk
// @route   POST /api/pupuk
// @access  Public
const createPupuk = async (req, res) => {
  const { nama, jenis, satuan, harga } = req.body;

  if (!nama || !jenis || !satuan || !harga) {
    return res.status(400).json({ message: 'Semua kolom harus diisi' });
  }

  try {
    const pupuk = await Pupuk.create({ nama, jenis, satuan, harga });
    res.status(201).json(pupuk);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.nama) {
      return res.status(409).json({ message: 'Nama pupuk sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal menambahkan pupuk', error: error.message });
  }
};

// @desc    Update pupuk
// @route   PUT /api/pupuk/:id
// @access  Public
const updatePupuk = async (req, res) => {
  const { nama, jenis, satuan, harga } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Pupuk tidak valid' });
    }
    const pupuk = await Pupuk.findById(req.params.id);
    if (!pupuk) {
      return res.status(404).json({ message: 'Pupuk tidak ditemukan' });
    }

    pupuk.nama = nama !== undefined ? nama : pupuk.nama;
    pupuk.jenis = jenis !== undefined ? jenis : pupuk.jenis;
    pupuk.satuan = satuan !== undefined ? satuan : pupuk.satuan;
    pupuk.harga = harga !== undefined ? harga : pupuk.harga;

    await pupuk.save();
    res.status(200).json(pupuk);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.nama) {
      return res.status(409).json({ message: 'Nama pupuk sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal memperbarui pupuk', error: error.message });
  }
};

// @desc    Delete pupuk
// @route   DELETE /api/pupuk/:id
// @access  Public
const deletePupuk = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Pupuk tidak valid' });
    }
    const result = await Pupuk.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Pupuk tidak ditemukan' });
    }
    res.status(200).json({ message: 'Pupuk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus pupuk', error: error.message });
  }
};

module.exports = {
  getPupuks,
  getPupukById,
  createPupuk,
  updatePupuk,
  deletePupuk,
};