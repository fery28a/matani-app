const Penanaman = require('../models/Penanaman');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all penanaman records (with optional lahan filter)
// @route   GET /api/kegiatan/penanaman
// @access  Public
const getPenanamans = async (req, res) => {
  try {
    const { lahanId } = req.query; // Ambil lahanId dari query parameter
    let filter = {};
    if (lahanId) {
      if (!isValidObjectId(lahanId)) {
        return res.status(400).json({ message: 'ID Lahan tidak valid pada filter.' });
      }
      filter.lahan = lahanId; // Tambahkan filter jika lahanId ada dan valid
    }

    const penanamans = await Penanaman.find(filter) // Terapkan filter
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'benihDigunakan.benih', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' }
      ]);
      
    const totalKeseluruhanBiaya = penanamans.reduce((sum, record) => sum + record.totalBiaya, 0);

    res.status(200).json({
      data: penanamans,
      totalKeseluruhanBiaya: totalKeseluruhanBiaya
    });
  } catch (error) {
    console.error('Error in getPenanamans:', error);
    res.status(500).json({ message: 'Gagal mengambil data penanaman', error: error.message });
  }
};

// @desc    Get single penanaman record by ID
// @route   GET /api/kegiatan/penanaman/:id
// @access  Public
const getPenanamanById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Penanaman tidak valid' });
    }
    const penanaman = await Penanaman.findById(req.params.id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'benihDigunakan.benih', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' }
      ]);
    if (!penanaman) {
      return res.status(404).json({ message: 'Data penanaman tidak ditemukan' });
    }
    res.status(200).json(penanaman);
  } catch (error) {
    console.error('Error in getPenanamanById:', error);
    res.status(500).json({ message: 'Gagal mengambil data penanaman', error: error.message });
  }
};

// @desc    Create new penanaman record
// @route   POST /api/kegiatan/penanaman
// @access  Public
const createPenanaman = async (req, res) => {
  const {
    lahan,
    tanggal,
    deskripsi,
    benihDigunakan = [],
    kebutuhanDigunakan = [],
    pekerja = []
  } = req.body;

  if (!lahan || !tanggal) {
    return res.status(400).json({ message: 'Lahan dan tanggal penanaman harus diisi' });
  }
  if (!isValidObjectId(lahan)) {
    console.error('Validation Error: Invalid Lahan ID format.', lahan);
    return res.status(400).json({ message: 'ID Lahan tidak valid' });
  }

  for (const item of benihDigunakan) {
    if (item.benih && !isValidObjectId(item.benih)) {
        console.error('Validation Error: Invalid Benih ID format.', item.benih);
        return res.status(400).json({ message: 'ID Benih tidak valid' });
    }
  }
  for (const item of kebutuhanDigunakan) {
    if (item.kebutuhan && !isValidObjectId(item.kebutuhan)) {
        console.error('Validation Error: Invalid Kebutuhan ID format.', item.kebutuhan);
        return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
    }
  }

  try {
    const newPenanaman = await Penanaman.create({
      lahan,
      tanggal,
      deskripsi,
      benihDigunakan,
      kebutuhanDigunakan,
      pekerja,
    });

    const populatedRecord = await Penanaman.findById(newPenanaman._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'benihDigunakan.benih', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' }
      ]);

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Error in createPenanaman:', error);
    res.status(500).json({ message: 'Gagal menambahkan data penanaman', error: error.message });
  }
};

// @desc    Update penanaman record
// @route   PUT /api/kegiatan/penanaman/:id
// @access  Public
const updatePenanaman = async (req, res) => {
  const {
    lahan,
    tanggal,
    deskripsi,
    benihDigunakan = [],
    kebutuhanDigunakan = [],
    pekerja = []
  } = req.body;

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Penanaman tidak valid' });
    }
    const penanaman = await Penanaman.findById(req.params.id);
    if (!penanaman) {
      return res.status(404).json({ message: 'Data penanaman tidak ditemukan' });
    }

    if (lahan && !isValidObjectId(lahan)) {
        console.error('Validation Error: Invalid Lahan ID format during update.', lahan);
        return res.status(400).json({ message: 'ID Lahan tidak valid' });
    }
    for (const item of benihDigunakan) {
      if (item.benih && !isValidObjectId(item.benih)) {
          console.error('Validation Error: Invalid Benih ID format during update.', item.benih);
          return res.status(400).json({ message: 'ID Benih tidak valid' });
      }
    }
    for (const item of kebutuhanDigunakan) {
      if (item.kebutuhan && !isValidObjectId(item.kebutuhan)) {
          console.error('Validation Error: Invalid Kebutuhan ID format during update.', item.kebutuhan);
          return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
      }
    }

    penanaman.lahan = lahan || penanaman.lahan;
    penanaman.tanggal = tanggal || penanaman.tanggal;
    penanaman.deskripsi = deskripsi !== undefined ? deskripsi : penanaman.deskripsi;
    penanaman.benihDigunakan = benihDigunakan;
    penanaman.kebutuhanDigunakan = kebutuhanDigunakan;
    penanaman.pekerja = pekerja;

    await penanaman.save();

    const populatedRecord = await Penanaman.findById(penanaman._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'benihDigunakan.benih', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' }
      ]);

    res.status(200).json(populatedRecord);
  } catch (error) {
    console.error('Error in updatePenanaman:', error);
    res.status(500).json({ message: 'Gagal memperbarui data penanaman', error: error.message });
  }
};

// @desc    Delete penanaman record
// @route   DELETE /api/kegiatan/penanaman/:id
// @access  Public
const deletePenanaman = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Penanaman tidak valid' });
    }
    const result = await Penanaman.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Data penanaman tidak ditemukan' });
    }
    res.status(200).json({ message: 'Data penanaman berhasil dihapus' });
  } catch (error) { // <--- BLOK CATCH YANG BENAR
    console.error('Error in deletePenanaman:', error);
    res.status(500).json({ message: 'Gagal menghapus data penanaman', error: error.message });
  }
};

module.exports = {
  getPenanamans,
  getPenanamanById,
  createPenanaman,
  updatePenanaman,
  deletePenanaman,
};