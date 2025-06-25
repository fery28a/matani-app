const Penyemprotan = require('../models/Penyemprotan');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all penyemprotan records (with optional lahan filter)
// @route   GET /api/kegiatan/penyemprotan
// @access  Public
const getPenyemprotans = async (req, res) => {
  try {
    const { lahanId } = req.query; // Ambil lahanId dari query parameter
    let filter = {};
    if (lahanId) {
      if (!isValidObjectId(lahanId)) {
        return res.status(400).json({ message: 'ID Lahan tidak valid pada filter.' });
      }
      filter.lahan = lahanId; // Tambahkan filter jika lahanId ada dan valid
    }

    const penyemprotans = await Penyemprotan.find(filter) // Terapkan filter
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);
      
    const totalKeseluruhanBiaya = penyemprotans.reduce((sum, record) => sum + record.totalBiaya, 0);

    res.status(200).json({
      data: penyemprotans,
      totalKeseluruhanBiaya: totalKeseluruhanBiaya
    });
  } catch (error) {
    console.error('Error in getPenyemprotans:', error);
    res.status(500).json({ message: 'Gagal mengambil data penyemprotan', error: error.message });
  }
};

// @desc    Get single penyemprotan record by ID
// @route   GET /api/kegiatan/penyemprotan/:id
// @access  Public
const getPenyemprotanById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Penyemprotan tidak valid' });
    }
    const penyemprotan = await Penyemprotan.findById(req.params.id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);
    if (!penyemprotan) {
      return res.status(404).json({ message: 'Data penyemprotan tidak ditemukan' });
    }
    res.status(200).json(penyemprotan);
  } catch (error) {
    console.error('Error in getPenyemprotanById:', error);
    res.status(500).json({ message: 'Gagal mengambil data penyemprotan', error: error.message });
  }
};

// @desc    Create new penyemprotan record
// @route   POST /api/kegiatan/penyemprotan
// @access  Public
const createPenyemprotan = async (req, res) => {
  const {
    lahan,
    tanggal,
    deskripsi,
    pestisidaDigunakan = [],
    pekerja = []
  } = req.body;

  if (!lahan || !tanggal) {
    return res.status(400).json({ message: 'Lahan dan tanggal kegiatan harus diisi' });
  }
  if (!isValidObjectId(lahan)) {
    console.error('Validation Error: Invalid Lahan ID format.', lahan);
    return res.status(400).json({ message: 'ID Lahan tidak valid' });
  }

  for (const item of pestisidaDigunakan) {
    if (item.pestisida && !isValidObjectId(item.pestisida)) {
        console.error('Validation Error: Invalid Pestisida ID format.', item.pestisida);
        return res.status(400).json({ message: 'ID Pestisida tidak valid' });
    }
  }

  try {
    const newPenyemprotan = await Penyemprotan.create({
      lahan,
      tanggal,
      deskripsi,
      pestisidaDigunakan,
      pekerja,
    });

    const populatedRecord = await Penyemprotan.findById(newPenyemprotan._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Error in createPenyemprotan:', error);
    res.status(500).json({ message: 'Gagal menambahkan data penyemprotan', error: error.message });
  }
};

// @desc    Update penyemprotan record
// @route   PUT /api/kegiatan/penyemprotan/:id
// @access  Public
const updatePenyemprotan = async (req, res) => {
  const {
    lahan,
    tanggal,
    deskripsi,
    pestisidaDigunakan = [],
    pekerja = []
  } = req.body;

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Penyemprotan tidak valid' });
    }
    const penyemprotan = await Penyemprotan.findById(req.params.id);
    if (!penyemprotan) {
      return res.status(404).json({ message: 'Data penyemprotan tidak ditemukan' });
    }

    if (lahan && !isValidObjectId(lahan)) {
        console.error('Validation Error: Invalid Lahan ID format during update.', lahan);
        return res.status(400).json({ message: 'ID Lahan tidak valid' });
    }
    for (const item of pestisidaDigunakan) {
      if (item.pestisida && !isValidObjectId(item.pestisida)) {
          console.error('Validation Error: Invalid Pestisida ID format during update.', item.pestisida);
          return res.status(400).json({ message: 'ID Pestisida tidak valid' });
      }
    }

    penyemprotan.lahan = lahan || penyemprotan.lahan;
    penyemprotan.tanggal = tanggal || penyemprotan.tanggal;
    penyemprotan.deskripsi = deskripsi !== undefined ? deskripsi : penyemprotan.deskripsi;
    penyemprotan.pestisidaDigunakan = pestisidaDigunakan;
    penyemprotan.pekerja = pekerja;

    await penyemprotan.save();

    const populatedRecord = await Penyemprotan.findById(penyemprotan._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);

    res.status(200).json(populatedRecord);
  } catch (error) {
    console.error('Error in updatePenyemprotan:', error);
    res.status(500).json({ message: 'Gagal memperbarui data penyemprotan', error: error.message });
  }
};

// @desc    Delete penyemprotan record
// @route   DELETE /api/kegiatan/penyemprotan/:id
// @access  Public
const deletePenyemprotan = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Penyemprotan tidak valid' });
    }
    const result = await Penyemprotan.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Data penyemprotan tidak ditemukan' });
    }
    res.status(200).json({ message: 'Data penyemprotan berhasil dihapus' });
  } catch (error) {
    console.error('Error in deletePenyemprotan:', error);
    res.status(500).json({ message: 'Gagal menghapus data penyemprotan', error: error.message });
  }
};

module.exports = {
  getPenyemprotans,
  getPenyemprotanById,
  createPenyemprotan,
  updatePenyemprotan,
  deletePenyemprotan,
};