// server/models/PerawatanTanaman.js
const mongoose = require('mongoose');

const perawatanTanamanSchema = mongoose.Schema(
  {
    lahan: {
      type: mongoose.Schema.Types.ObjectId, // Referensi ke ID Lahan
      ref: 'Lahan', // Menunjukkan model yang direferensikan
      required: [true, 'Lahan harus dipilih'],
    },
    tanggal: {
      type: Date,
      required: [true, 'Tanggal kegiatan harus diisi'],
    },
    deskripsi: {
      type: String,
      trim: true,
      default: '',
    },
    pupukDigunakan: [ // Array objek untuk pupuk yang digunakan (opsional)
      {
        pupuk: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pupuk',
          required: [true, 'Pupuk harus dipilih'],
        },
        jumlah: {
          type: Number,
          required: [true, 'Jumlah pupuk harus diisi'],
          min: [0, 'Jumlah pupuk tidak boleh negatif'],
        },
      },
    ],
    kebutuhanDigunakan: [ // Array objek untuk kebutuhan yang digunakan (opsional)
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
    pestisidaDigunakan: [ // Array objek untuk pestisida yang digunakan (opsional)
      {
        pestisida: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pestisida',
          required: [true, 'Pestisida harus dipilih'],
        },
        jumlah: { // Jumlah dalam satuan master (Gram/Ml)
          type: Number,
          required: [true, 'Jumlah pestisida harus diisi'],
          min: [0, 'Jumlah pestisida tidak boleh negatif'],
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
perawatanTanamanSchema.pre('save', async function(next) {
  let calculatedTotalBiaya = 0;

  const Pupuk = mongoose.model('Pupuk');
  const Kebutuhan = mongoose.model('Kebutuhan');
  const Pestisida = mongoose.model('Pestisida');

  // Hitung biaya pupuk
  for (const item of this.pupukDigunakan) {
    const pupukDoc = await Pupuk.findById(item.pupuk);
    if (pupukDoc) {
      calculatedTotalBiaya += pupukDoc.harga * item.jumlah;
    }
  }

  // Hitung biaya kebutuhan
  for (const item of this.kebutuhanDigunakan) {
    const kebutuhanDoc = await Kebutuhan.findById(item.kebutuhan);
    if (kebutuhanDoc) {
      calculatedTotalBiaya += kebutuhanDoc.harga * item.jumlah;
    }
  }

  // Hitung biaya pestisida
  for (const item of this.pestisidaDigunakan) {
    const pestisidaDoc = await Pestisida.findById(item.pestisida);
    if (pestisidaDoc) {
      // Harga per unit kecil dari pestisida master (harga / beratVolume)
      const hargaPerUnitKecil = pestisidaDoc.harga / pestisidaDoc.beratVolume;
      calculatedTotalBiaya += hargaPerUnitKecil * item.jumlah;
    }
  }

  // Hitung biaya pekerja
  for (const p of this.pekerja) {
    calculatedTotalBiaya += p.biaya;
  }

  this.totalBiaya = calculatedTotalBiaya;
  next();
});

const PerawatanTanaman = mongoose.model('PerawatanTanaman', perawatanTanamanSchema);

module.exports = PerawatanTanaman;