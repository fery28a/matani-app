const Panen = require('../models/Panen');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all panen records (with optional lahan filter)
// @route   GET /api/kegiatan/panen
// @access  Public
const getPanens = async (req, res) => {
  try {
    const { lahanId } = req.query; // Ambil lahanId dari query parameter
    let filter = {};
    if (lahanId) {
      if (!isValidObjectId(lahanId)) {
        return res.status(400).json({ message: 'ID Lahan tidak valid pada filter.' });
      }
      filter.lahan = lahanId; // Tambahkan filter jika lahanId ada dan valid
    }

    const panens = await Panen.find(filter) // Terapkan filter
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' }
      ]);
      
    const totalKeseluruhanBiaya = panens.reduce((sum, record) => sum + record.totalBiaya, 0);

    res.status(200).json({
      data: panens,
      totalKeseluruhanBiaya: totalKeseluruhanBiaya
    });
  } catch (error) {
    console.error('Error in getPanens:', error);
    res.status(500).json({ message: 'Gagal mengambil data panen', error: error.message });
  }
};

// @desc    Get single panen record by ID
// @route   GET /api/kegiatan/panen/:id
// @access  Public
const getPanenById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Panen tidak valid' });
    }
    const panen = await Panen.findById(req.params.id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' }
      ]);
    if (!panen) {
      return res.status(404).json({ message: 'Data panen tidak ditemukan' });
    }
    res.status(200).json(panen);
  } catch (error) {
    console.error('Error in getPanenById:', error);
    res.status(500).json({ message: 'Gagal mengambil data panen', error: error.message });
  }
};

// @desc    Create new panen record
// @route   POST /api/kegiatan/panen
// @access  Public
const createPanen = async (req, res) => {
  const {
    lahan,
    tanggal,
    deskripsi,
    kebutuhanDigunakan = [],
    pekerja = []
  } = req.body;

  if (!lahan || !tanggal) {
    return res.status(400).json({ message: 'Lahan dan tanggal panen harus diisi' });
  }
  if (!isValidObjectId(lahan)) {
    console.error('Validation Error: Invalid Lahan ID format.', lahan);
    return res.status(400).json({ message: 'ID Lahan tidak valid' });
  }

  for (const item of kebutuhanDigunakan) {
    if (item.kebutuhan && !isValidObjectId(item.kebutuhan)) {
        console.error('Validation Error: Invalid Kebutuhan ID format.', item.kebutuhan);
        return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
    }
  }

  try {
    const newPanen = await Panen.create({
      lahan,
      tanggal,
      deskripsi,
      kebutuhanDigunakan,
      pekerja,
    });

    const populatedRecord = await Panen.findById(newPanen._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' }
      ]);

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Error in createPanen:', error);
    res.status(500).json({ message: 'Gagal menambahkan data panen', error: error.message });
  }
};

// @desc    Update panen record
// @route   PUT /api/kegiatan/panen/:id
// @access  Public
const updatePanen = async (req, res) => {
  const {
    lahan,
    tanggal,
    deskripsi,
    kebutuhanDigunakan = [],
    pekerja = []
  } = req.body;

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Panen tidak valid' });
    }
    const panen = await Panen.findById(req.params.id);
    if (!panen) {
      return res.status(404).json({ message: 'Data panen tidak ditemukan' });
    }

    if (lahan && !isValidObjectId(lahan)) {
        console.error('Validation Error: Invalid Lahan ID format during update.', lahan);
        return res.status(400).json({ message: 'ID Lahan tidak valid' });
    }
    for (const item of kebutuhanDigunakan) {
      if (item.kebutuhan && !isValidObjectId(item.kebutuhan)) {
          console.error('Validation Error: Invalid Kebutuhan ID format during update.', item.kebutuhan);
          return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
      }
    }

    panen.lahan = lahan || panen.lahan;
    panen.tanggal = tanggal || panen.tanggal;
    panen.deskripsi = deskripsi !== undefined ? deskripsi : panen.deskripsi;
    panen.kebutuhanDigunakan = kebutuhanDigunakan;
    panen.pekerja = pekerja;

    await panen.save();

    const populatedRecord = await Panen.findById(panen._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' }
      ]);

    res.status(200).json(populatedRecord);
  } catch (error) {
    console.error('Error in updatePanen:', error);
    res.status(500).json({ message: 'Gagal memperbarui data panen', error: error.message });
  }
};

// @desc    Delete panen record
// @route   DELETE /api/kegiatan/panen/:id
// @access  Public
const deletePanen = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Panen tidak valid' });
    }
    const result = await Panen.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Data panen tidak ditemukan' });
    }
    res.status(200).json({ message: 'Data panen berhasil dihapus' });
  } catch (error) {
    console.error('Error in deletePanen:', error);
    res.status(500).json({ message: 'Gagal menghapus data panen', error: error.message });
  }
};

module.exports = {
  getPanens,
  getPanenById,
  createPanen,
  updatePanen,
  deletePanen,
};