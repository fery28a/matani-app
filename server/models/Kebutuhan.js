// server/models/Kebutuhan.js
const mongoose = require('mongoose');

const kebutuhanSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama kebutuhan harus diisi'],
      unique: true, // Nama kebutuhan harus unik
      trim: true,
    },
    satuan: {
      type: String,
      required: [true, 'Satuan kebutuhan harus diisi'],
      trim: true,
    },
    harga: {
      type: Number,
      required: [true, 'Harga kebutuhan harus diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

const Kebutuhan = mongoose.model('Kebutuhan', kebutuhanSchema);

module.exports = Kebutuhan;