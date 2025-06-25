const PengolahanLahan = require('../models/PengolahanLahan');
const mongoose = require('mongoose');

// Helper function to check if ID is valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all pengolahan lahan records (with optional lahan filter)
// @route   GET /api/kegiatan/pengolahan-lahan
// @access  Public
const getPengolahanLahans = async (req, res) => {
  try {
    const { lahanId } = req.query; // Ambil lahanId dari query parameter
    let filter = {};
    if (lahanId) {
      if (!isValidObjectId(lahanId)) {
        return res.status(400).json({ message: 'ID Lahan tidak valid pada filter.' });
      }
      filter.lahan = lahanId; // Tambahkan filter jika lahanId ada dan valid
    }

    const pengolahanLahans = await PengolahanLahan.find(filter) // Terapkan filter
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pupukDigunakan.pupuk', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);

    // Hitung total biaya keseluruhan untuk hasil yang difilter
    const totalKeseluruhanBiaya = pengolahanLahans.reduce((sum, record) => sum + record.totalBiaya, 0);

    res.status(200).json({
      data: pengolahanLahans,
      totalKeseluruhanBiaya: totalKeseluruhanBiaya
    });
  } catch (error) {
    console.error('Error in getPengolahanLahans:', error); // Logging error
    res.status(500).json({ message: 'Gagal mengambil data pengolahan lahan', error: error.message });
  }
};

// @desc    Get single pengolahan lahan record by ID
// @route   GET /api/kegiatan/pengolahan-lahan/:id
// @access  Public
const getPengolahanLahanById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Pengolahan Lahan tidak valid' });
    }

    const pengolahanLahan = await PengolahanLahan.findById(req.params.id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pupukDigunakan.pupuk', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);

    if (!pengolahanLahan) {
      return res.status(404).json({ message: 'Data pengolahan lahan tidak ditemukan' });
    }
    res.status(200).json(pengolahanLahan);
  } catch (error) {
    console.error('Error in getPengolahanLahanById:', error); // Logging error
    res.status(500).json({ message: 'Gagal mengambil data pengolahan lahan', error: error.message });
  }
};

// @desc    Create new pengolahan lahan record
// @route   POST /api/kegiatan/pengolahan-lahan
// @access  Public
const createPengolahanLahan = async (req, res) => {
  const {
    lahan,
    tanggal,
    deskripsi,
    pupukDigunakan = [],
    kebutuhanDigunakan = [],
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

  for (const item of pupukDigunakan) {
    if (item.pupuk && !isValidObjectId(item.pupuk)) {
        console.error('Validation Error: Invalid Pupuk ID format.', item.pupuk);
        return res.status(400).json({ message: 'ID Pupuk tidak valid' });
    }
  }
  for (const item of kebutuhanDigunakan) {
    if (item.kebutuhan && !isValidObjectId(item.kebutuhan)) {
        console.error('Validation Error: Invalid Kebutuhan ID format.', item.kebutuhan);
        return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
    }
  }
  for (const item of pestisidaDigunakan) {
    if (item.pestisida && !isValidObjectId(item.pestisida)) {
        console.error('Validation Error: Invalid Pestisida ID format.', item.pestisida);
        return res.status(400).json({ message: 'ID Pestisida tidak valid' });
    }
  }

  try {
    const newPengolahanLahan = await PengolahanLahan.create({
      lahan,
      tanggal,
      deskripsi,
      pupukDigunakan,
      kebutuhanDigunakan,
      pestisidaDigunakan,
      pekerja,
    });
    const populatedRecord = await PengolahanLahan.findById(newPengolahanLahan._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pupukDigunakan.pupuk', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Error in createPengolahanLahan:', error);
    res.status(500).json({ message: 'Gagal menambahkan data pengolahan lahan', error: error.message });
  }
};

// @desc    Update pengolahan lahan record
// @route   PUT /api/kegiatan/pengolahan-lahan/:id
// @access  Public
const updatePengolahanLahan = async (req, res) => {
  const {
    lahan,
    tanggal,
    deskripsi,
    pupukDigunakan = [],
    kebutuhanDigunakan = [],
    pestisidaDigunakan = [],
    pekerja = []
  } = req.body;

  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Pengolahan Lahan tidak valid' });
    }

    const pengolahanLahan = await PengolahanLahan.findById(req.params.id);
    if (!pengolahanLahan) {
      return res.status(404).json({ message: 'Data pengolahan lahan tidak ditemukan' });
    }

    if (lahan && !isValidObjectId(lahan)) {
        console.error('Validation Error: Invalid Lahan ID format during update.', lahan);
        return res.status(400).json({ message: 'ID Lahan tidak valid' });
    }
    for (const item of pupukDigunakan) {
      if (item.pupuk && !isValidObjectId(item.pupuk)) {
          console.error('Validation Error: Invalid Pupuk ID format during update.', item.pupuk);
          return res.status(400).json({ message: 'ID Pupuk tidak valid' });
      }
    }
    for (const item of kebutuhanDigunakan) {
      if (item.kebutuhan && !isValidObjectId(item.kebutuhan)) {
          console.error('Validation Error: Invalid Kebutuhan ID format during update.', item.kebutuhan);
          return res.status(400).json({ message: 'ID Kebutuhan tidak valid' });
      }
    }
    for (const item of pestisidaDigunakan) {
      if (item.pestisida && !isValidObjectId(item.pestisida)) {
          console.error('Validation Error: Invalid Pestisida ID format during update.', item.pestisida);
          return res.status(400).json({ message: 'ID Pestisida tidak valid' });
      }
    }

    pengolahanLahan.lahan = lahan || pengolahanLahan.lahan;
    pengolahanLahan.tanggal = tanggal || pengolahanLahan.tanggal;
    pengolahanLahan.deskripsi = deskripsi !== undefined ? deskripsi : pengolahanLahan.deskripsi;
    pengolahanLahan.pupukDigunakan = pupukDigunakan;
    pengolahanLahan.kebutuhanDigunakan = kebutuhanDigunakan;
    pengolahanLahan.pestisidaDigunakan = pestisidaDigunakan;
    pengolahanLahan.pekerja = pekerja;

    await pengolahanLahan.save(); // `pre('save')` middleware akan recalculate totalBiaya

    const populatedRecord = await PengolahanLahan.findById(pengolahanLahan._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pupukDigunakan.pupuk', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);

    res.status(200).json(populatedRecord);
  } catch (error) {
    console.error('Error in updatePengolahanLahan:', error);
    res.status(500).json({ message: 'Gagal memperbarui data pengolahan lahan', error: error.message });
  }
};

// @desc    Delete pengolahan lahan record
// @route   DELETE /api/kegiatan/pengolahan-lahan/:id
// @access  Public
const deletePengolahanLahan = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Pengolahan Lahan tidak valid' });
    }
    const result = await PengolahanLahan.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Data pengolahan lahan tidak ditemukan' });
    }
    res.status(200).json({ message: 'Data pengolahan lahan berhasil dihapus' });
  } catch (error) {
    console.error('Error in deletePengolahanLahan:', error);
    res.status(500).json({ message: 'Gagal menghapus data pengolahan lahan', error: error.message });
  }
};

module.exports = {
  getPengolahanLahans,
  getPengolahanLahanById,
  createPengolahanLahan,
  updatePengolahanLahan,
  deletePengolahanLahan,
};