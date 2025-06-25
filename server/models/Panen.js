// server/models/Panen.js
const mongoose = require('mongoose');

const panenSchema = mongoose.Schema(
  {
    lahan: { // Tambahkan referensi lahan meskipun tidak secara eksplisit diminta di prompt, ini penting untuk laporan
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lahan',
      required: [true, 'Lahan harus dipilih'],
    },
    tanggal: {
      type: Date,
      required: [true, 'Tanggal panen harus diisi'],
    },
    deskripsi: {
      type: String,
      trim: true,
      default: '',
    },
    kebutuhanDigunakan: [ // Array objek untuk kebutuhan yang digunakan
      {
        kebutuhan: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Kebutuhan',
          required: [true, 'Kebutuhan harus dipilih'],
        },
        jumlah: {
          type: Number,
          required: [true, 'Jumlah kebutuhan harus diisi'],
          min: [0, 'Jumlah kebutuhan tidak boleh negatif'],
        },
      },
    ],
    pekerja: [ // Array objek untuk pekerja dan biaya
      {
        nama: {
          type: String,
          required: [true, 'Nama pekerja harus diisi'],
          trim: true,
        },
        biaya: {
          type: Number,
          required: [true, 'Biaya pekerja harus diisi'],
          min: [0, 'Biaya pekerja tidak boleh negatif'],
        },
      },
    ],
    totalBiaya: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Middleware Mongoose untuk menghitung total biaya sebelum menyimpan
panenSchema.pre('save', async function(next) {
  let calculatedTotalBiaya = 0;

  const Kebutuhan = mongoose.model('Kebutuhan');

  // Hitung biaya kebutuhan
  for (const item of this.kebutuhanDigunakan) {
    const kebutuhanDoc = await Kebutuhan.findById(item.kebutuhan);
    if (kebutuhanDoc) {
      calculatedTotalBiaya += kebutuhanDoc.harga * item.jumlah;
    }
  }

  // Hitung biaya pekerja
  for (const p of this.pekerja) {
    calculatedTotalBiaya += p.biaya;
  }

  this.totalBiaya = calculatedTotalBiaya;
  next();
});

const Panen = mongoose.model('Panen', panenSchema);

module.exports = Panen;