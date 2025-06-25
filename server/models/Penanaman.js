// server/models/Penanaman.js
const mongoose = require('mongoose');

const penanamanSchema = mongoose.Schema(
  {
    lahan: {
      type: mongoose.Schema.Types.ObjectId, // Referensi ke ID Lahan
      ref: 'Lahan', // Menunjukkan model yang direferensikan
      required: [true, 'Lahan harus dipilih'],
    },
    tanggal: {
      type: Date,
      required: [true, 'Tanggal penanaman harus diisi'],
    },
    deskripsi: {
      type: String,
      trim: true,
      default: '',
    },
    benihDigunakan: [ // Array objek untuk benih yang digunakan
      {
        benih: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Benih',
          required: [true, 'Benih harus dipilih'],
        },
        jumlah: {
          type: Number,
          required: [true, 'Jumlah benih harus diisi'],
          min: [0, 'Jumlah benih tidak boleh negatif'],
        },
      },
    ],
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
penanamanSchema.pre('save', async function(next) {
  let calculatedTotalBiaya = 0;

  const Benih = mongoose.model('Benih');
  const Kebutuhan = mongoose.model('Kebutuhan');

  // Hitung biaya benih
  for (const item of this.benihDigunakan) {
    const benihDoc = await Benih.findById(item.benih);
    if (benihDoc) {
      calculatedTotalBiaya += benihDoc.harga * item.jumlah;
    }
  }

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

const Penanaman = mongoose.model('Penanaman', penanamanSchema);

module.exports = Penanaman;