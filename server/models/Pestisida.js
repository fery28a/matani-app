// server/models/Pestisida.js
const mongoose = require('mongoose');

const pestisidaSchema = mongoose.Schema(
  {
    namaDagang: {
      type: String,
      required: [true, 'Nama dagang harus diisi'],
      unique: true, // Nama dagang pestisida harus unik
      trim: true,
    },
    jenisPestisida: {
      type: String,
      required: [true, 'Jenis pestisida harus diisi'],
      enum: ['Fungisida', 'Insektisida', 'Bakterisida', 'Nematisida', 'Herbisida', 'Surfaktan', 'Zpt', 'Nutrisi'],
    },
    bahanAktif: {
      type: String,
      required: [true, 'Bahan aktif harus diisi'],
      trim: true,
    },
    beratVolume: { // Untuk menyimpan nilai numerik dari berat atau volume
      type: Number,
      required: [true, 'Berat/Volume harus diisi'],
      min: [0, 'Berat/Volume tidak boleh negatif'],
    },
    satuan: {
      type: String,
      required: [true, 'Satuan harus diisi'],
      enum: ['Gram', 'Ml'], // Pilihan satuan yang diizinkan
    },
    harga: { // Harga per unit berat/volume saat pembelian
      type: Number,
      required: [true, 'Harga harus diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

const Pestisida = mongoose.model('Pestisida', pestisidaSchema);

module.exports = Pestisida;