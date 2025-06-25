// server/app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Models (agar Mongoose mengenalnya)
require('./models/Lahan');
require('./models/Pupuk');
require('./models/Pestisida');
require('./models/Kebutuhan');
require('./models/Benih');
require('./models/User'); // <--- TAMBAH BARIS INI (Import Model User)

// Import Kegiatan Models
require('./models/PengolahanLahan');
require('./models/Penanaman');
require('./models/PerawatanTanaman');
require('./models/Penyemprotan');
require('./models/Panen');

// Import Rute API
const lahanRoutes = require('./routes/lahanRoutes');
const benihRoutes = require('./routes/benihRoutes');
const pupukRoutes = require('./routes/pupukRoutes');
const pestisidaRoutes = require('./routes/pestisidaRoutes');
const kebutuhanRoutes = require('./routes/kebutuhanRoutes');
const userRoutes = require('./routes/userRoutes'); // <--- TAMBAH BARIS INI (Import Rute User)

// Import Rute Kegiatan
const pengolahanLahanRoutes = require('./routes/pengolahanLahanRoutes');
const penanamanRoutes = require('./routes/penanamanRoutes');
const perawatanTanamanRoutes = require('./routes/perawatanTanamanRoutes');
const penyemprotanRoutes = require('./routes/penyemprotanRoutes');
const panenRoutes = require('./routes/panenRoutes');

// Import Middleware (optional, for protecting routes)
const { protect } = require('./middleware/authMiddleware'); // <--- TAMBAH BARIS INI

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rute API
app.get('/', (req, res) => {
  res.send('API Matani Berjalan!');
});

// Rute Publik (Login)
app.use('/api/users', userRoutes); // <--- Rute User (login)

// Rute yang Dilindungi (Contoh: Semua Master Data dan Kegiatan akan dilindungi)
// Ini akan membutuhkan token JWT di header Authorization: Bearer <token>
app.use('/api/lahan', protect, lahanRoutes); // <--- Tambahkan 'protect'
app.use('/api/benih', protect, benihRoutes); // <--- Tambahkan 'protect'
app.use('/api/pupuk', protect, pupukRoutes); // <--- Tambahkan 'protect'
app.use('/api/pestisida', protect, pestisidaRoutes); // <--- Tambahkan 'protect'
app.use('/api/kebutuhan', protect, kebutuhanRoutes); // <--- Tambahkan 'protect'

app.use('/api/kegiatan/pengolahan-lahan', protect, pengolahanLahanRoutes); // <--- Tambahkan 'protect'
app.use('/api/kegiatan/penanaman', protect, penanamanRoutes);             // <--- Tambahkan 'protect'
app.use('/api/kegiatan/perawatan-tanaman', protect, perawatanTanamanRoutes); // <--- Tambahkan 'protect'
app.use('/api/kegiatan/penyemprotan', protect, penyemprotanRoutes);       // <--- Tambahkan 'protect'
app.use('/api/kegiatan/panen', protect, panenRoutes);                     // <--- Tambahkan 'protect'

// Catatan: Jika ada rute laporan yang perlu diakses tanpa login (misal untuk publik),
// jangan tambahkan 'protect' di rute tersebut.
// Saat ini, semua rute laporan (GET) masih diakses melalui rute kegiatan, jadi akan dilindungi.

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});