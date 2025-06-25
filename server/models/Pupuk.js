// server/models/Pupuk.js
const mongoose = require('mongoose');

const pupukSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama pupuk harus diisi'],
      unique: true, // Nama pupuk harus unik
      trim: true,
    },
    jenis: {
      type: String,
      required: [true, 'Jenis pupuk harus diisi'],
      trim: true,
    },
    satuan: {
      type: String,
      required: [true, 'Satuan pupuk harus diisi'],
      enum: ['Kg', 'Karung'], // Pilihan satuan yang diizinkan
    },
    harga: {
      type: Number,
      required: [true, 'Harga pupuk harus diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

const Pupuk = mongoose.model('Pupuk', pupukSchema);

module.exports = Pupuk;