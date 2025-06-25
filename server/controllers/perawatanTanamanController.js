const PerawatanTanaman = require('../models/PerawatanTanaman');
const mongoose = require('mongoose');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all perawatan tanaman records (with optional lahan filter)
// @route   GET /api/kegiatan/perawatan-tanaman
// @access  Public
const getPerawatanTanamans = async (req, res) => {
  try {
    const { lahanId } = req.query; // Ambil lahanId dari query parameter
    let filter = {};
    if (lahanId) {
      if (!isValidObjectId(lahanId)) {
        return res.status(400).json({ message: 'ID Lahan tidak valid pada filter.' });
      }
      filter.lahan = lahanId; // Tambahkan filter jika lahanId ada dan valid
    }

    const perawatanTanamans = await PerawatanTanaman.find(filter) // Terapkan filter
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pupukDigunakan.pupuk', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);
      
    const totalKeseluruhanBiaya = perawatanTanamans.reduce((sum, record) => sum + record.totalBiaya, 0);

    res.status(200).json({
      data: perawatanTanamans,
      totalKeseluruhanBiaya: totalKeseluruhanBiaya
    });
  } catch (error) {
    console.error('Error in getPerawatanTanamans:', error);
    res.status(500).json({ message: 'Gagal mengambil data perawatan tanaman', error: error.message });
  }
};

// @desc    Get single perawatan tanaman record by ID
// @route   GET /api/kegiatan/perawatan-tanaman/:id
// @access  Public
const getPerawatanTanamanById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Perawatan Tanaman tidak valid' });
    }
    const perawatanTanaman = await PerawatanTanaman.findById(req.params.id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pupukDigunakan.pupuk', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);
    if (!perawatanTanaman) {
      return res.status(404).json({ message: 'Data perawatan tanaman tidak ditemukan' });
    }
    res.status(200).json(perawatanTanaman);
  } catch (error) {
    console.error('Error in getPerawatanTanamanById:', error);
    res.status(500).json({ message: 'Gagal mengambil data perawatan tanaman', error: error.message });
  }
};

// @desc    Create new perawatan tanaman record
// @route   POST /api/kegiatan/perawatan-tanaman
// @access  Public
const createPerawatanTanaman = async (req, res) => {
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
    const newPerawatanTanaman = await PerawatanTanaman.create({
      lahan,
      tanggal,
      deskripsi,
      pupukDigunakan,
      kebutuhanDigunakan,
      pestisidaDigunakan,
      pekerja,
    });

    const populatedRecord = await PerawatanTanaman.findById(newPerawatanTanaman._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pupukDigunakan.pupuk', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);

    res.status(201).json(populatedRecord);
  } catch (error) {
    console.error('Error in createPerawatanTanaman:', error);
    res.status(500).json({ message: 'Gagal menambahkan data perawatan tanaman', error: error.message });
  }
};

// @desc    Update perawatan tanaman record
// @route   PUT /api/kegiatan/perawatan-tanaman/:id
// @access  Public
const updatePerawatanTanaman = async (req, res) => {
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
      return res.status(400).json({ message: 'ID Perawatan Tanaman tidak valid' });
    }
    const perawatanTanaman = await PerawatanTanaman.findById(req.params.id);
    if (!perawatanTanaman) {
      return res.status(404).json({ message: 'Data perawatan tanaman tidak ditemukan' });
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

    perawatanTanaman.lahan = lahan || perawatanTanaman.lahan;
    perawatanTanaman.tanggal = tanggal || perawatanTanaman.tanggal;
    perawatanTanaman.deskripsi = deskripsi !== undefined ? deskripsi : perawatanTanaman.deskripsi;
    perawatanTanaman.pupukDigunakan = pupukDigunakan;
    perawatanTanaman.kebutuhanDigunakan = kebutuhanDigunakan;
    perawatanTanaman.pestisidaDigunakan = pestisidaDigunakan;
    perawatanTanaman.pekerja = pekerja;

    await perawatanTanaman.save();

    const populatedRecord = await PerawatanTanaman.findById(perawatanTanaman._id)
      .populate([
        { path: 'lahan', select: 'nama luas' },
        { path: 'pupukDigunakan.pupuk', select: 'nama harga satuan' },
        { path: 'kebutuhanDigunakan.kebutuhan', select: 'nama harga satuan' },
        { path: 'pestisidaDigunakan.pestisida', select: 'namaDagang harga beratVolume satuan' }
      ]);

    res.status(200).json(populatedRecord);
  } catch (error) {
    console.error('Error in updatePerawatanTanaman:', error);
    res.status(500).json({ message: 'Gagal memperbarui data perawatan tanaman', error: error.message });
  }
};

// @desc    Delete perawatan tanaman record
// @route   DELETE /api/kegiatan/perawatan-tanaman/:id
// @access  Public
const deletePerawatanTanaman = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID Perawatan Tanaman tidak valid' });
    }
    const result = await PerawatanTanaman.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Data perawatan tanaman tidak ditemukan' });
    }
    res.status(200).json({ message: 'Data perawatan tanaman berhasil dihapus' });
  } catch (error) {
    console.error('Error in deletePerawatanTanaman:', error);
    res.status(500).json({ message: 'Gagal menghapus data perawatan tanaman', error: error.message });
  }
};

module.exports = {
  getPerawatanTanamans,
  getPerawatanTanamanById,
  createPerawatanTanaman,
  updatePerawatanTanaman,
  deletePerawatanTanaman,
};