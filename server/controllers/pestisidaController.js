// server/controllers/pestisidaController.js
const Pestisida = require('../models/Pestisida');
const mongoose = require('mongoose');

// @desc    Get all pestisida
// @route   GET /api/pestisida
// @access  Public
const getPestisidas = async (req, res) => {
  try {
    const pestisidas = await Pestisida.find({});
    res.status(200).json(pestisidas);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pestisida', error: error.message });
  }
};

// @desc    Get single pestisida by ID
// @route   GET /api/pestisida/:id
// @access  Public
const getPestisidaById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Pestisida tidak valid' });
    }
    const pestisida = await Pestisida.findById(req.params.id);
    if (!pestisida) {
      return res.status(404).json({ message: 'Pestisida tidak ditemukan' });
    }
    res.status(200).json(pestisida);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pestisida', error: error.message });
  }
};

// @desc    Create new pestisida
// @route   POST /api/pestisida
// @access  Public
const createPestisida = async (req, res) => {
  const { namaDagang, jenisPestisida, bahanAktif, beratVolume, satuan, harga } = req.body;

  if (!namaDagang || !jenisPestisida || !bahanAktif || !beratVolume || !satuan || !harga) {
    return res.status(400).json({ message: 'Semua kolom harus diisi' });
  }

  try {
    const pestisida = await Pestisida.create({ namaDagang, jenisPestisida, bahanAktif, beratVolume, satuan, harga });
    res.status(201).json(pestisida);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.namaDagang) {
      return res.status(409).json({ message: 'Nama dagang pestisida sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal menambahkan pestisida', error: error.message });
  }
};

// @desc    Update pestisida
// @route   PUT /api/pestisida/:id
// @access  Public
const updatePestisida = async (req, res) => {
  const { namaDagang, jenisPestisida, bahanAktif, beratVolume, satuan, harga } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Pestisida tidak valid' });
    }
    const pestisida = await Pestisida.findById(req.params.id);
    if (!pestisida) {
      return res.status(404).json({ message: 'Pestisida tidak ditemukan' });
    }

    pestisida.namaDagang = namaDagang !== undefined ? namaDagang : pestisida.namaDagang;
    pestisida.jenisPestisida = jenisPestisida !== undefined ? jenisPestisida : pestisida.jenisPestisida;
    pestisida.bahanAktif = bahanAktif !== undefined ? bahanAktif : pestisida.bahanAktif;
    pestisida.beratVolume = beratVolume !== undefined ? beratVolume : pestisida.beratVolume;
    pestisida.satuan = satuan !== undefined ? satuan : pestisida.satuan;
    pestisida.harga = harga !== undefined ? harga : pestisida.harga;

    await pestisida.save();
    res.status(200).json(pestisida);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.namaDagang) {
      return res.status(409).json({ message: 'Nama dagang pestisida sudah ada, silakan gunakan nama lain.' });
    }
    res.status(500).json({ message: 'Gagal memperbarui pestisida', error: error.message });
  }
};

// @desc    Delete pestisida
// @route   DELETE /api/pestisida/:id
// @access  Public
const deletePestisida = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID Pestisida tidak valid' });
    }
    const result = await Pestisida.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Pestisida tidak ditemukan' });
    }
    res.status(200).json({ message: 'Pestisida berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus pestisida', error: error.message });
  }
};

module.exports = {
  getPestisidas,
  getPestisidaById,
  createPestisida,
  updatePestisida,
  deletePestisida,
};