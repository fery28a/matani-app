const mongoose = require('mongoose');

const lahanSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama lahan harus diisi'],
      unique: true, // Nama lahan harus unik
      trim: true // Hapus spasi di awal/akhir
    },
    luas: {
      type: Number,
      required: [true, 'Luas lahan harus diisi'],
      min: [0, 'Luas lahan tidak boleh negatif']
    },
  },
  {
    timestamps: true, // Otomatis menambahkan createdAt dan updatedAt
  }
);

const Lahan = mongoose.model('Lahan', lahanSchema);

module.exports = Lahan;