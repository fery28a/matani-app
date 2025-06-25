// server/models/Penyemprotan.js
const mongoose = require('mongoose');

const penyemprotanSchema = mongoose.Schema(
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
    pestisidaDigunakan: [ // Array objek untuk pestisida yang digunakan
      {
        pestisida: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pestisida',
          required: [true, 'Pestisida harus dipilih'],
        },
        jumlah: { // Jumlah dalam satuan master (Gram/Ml) yang digunakan dalam penyemprotan ini
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
penyemprotanSchema.pre('save', async function(next) {
  let calculatedTotalBiaya = 0;

  const Pestisida = mongoose.model('Pestisida');

  // Hitung biaya pestisida
  for (const item of this.pestisidaDigunakan) {
    const pestisidaDoc = await Pestisida.findById(item.pestisida);
    if (pestisidaDoc) {
      // Perhitungan khusus: harga per gram/ml
      // missalkan saya membeli pestisida dengan harga 20000 dan berat 200 maka harga per gramnya adah 100
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

const Penyemprotan = mongoose.model('Penyemprotan', penyemprotanSchema);

module.exports = Penyemprotan;