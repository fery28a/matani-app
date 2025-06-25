// server/models/Benih.js
const mongoose = require('mongoose');

const benihSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama benih harus diisi'],
      unique: true, // Nama benih harus unik
      trim: true,
    },
    jenis: {
      type: String,
      required: [true, 'Jenis benih harus diisi'],
      trim: true,
    },
    satuan: {
      type: String,
      required: [true, 'Satuan benih harus diisi'],
      enum: ['Pcs', 'Kg'], // Pilihan satuan yang diizinkan
    },
    harga: {
      type: Number,
      required: [true, 'Harga benih harus diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

const Benih = mongoose.model('Benih', benihSchema);

module.exports = Benih;