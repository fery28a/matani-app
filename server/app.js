// server/app.js
const path = require('path'); // PENTING: Import module 'path'
// PENTING: Muat .env menggunakan absolute path
// Path ini mengasumsikan .env berada di root proyek (misal: /var/www/matani_final_app/.env)
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

// Debugging log untuk mengetahui direktori kerja Node.js dan status env vars
// Ini sangat membantu saat debugging di VPS
console.log('Node.js CWD:', process.cwd());
console.log('Node.js __dirname:', __dirname);
console.log('Absolute path to .env:', path.resolve(__dirname, '../.env'));
console.log('MONGO_URI from process.env:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + '...' : "MONGO_URI is undefined");
console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 30) + '...' : "JWT_SECRET is undefined");


const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // connectDB membaca process.env.MONGO_URI


// Import Models (agar Mongoose mengenalnya) - SEMUA MODEL HARUS DI-REQUIRE
require('./models/Lahan');
require('./models/Pupuk');
require('./models/Pestisida');
require('./models/Kebutuhan');
require('./models/Benih');
require('./models/User');

// Import Kegiatan Models - SEMUA MODEL HARUS DI-REQUIRE
require('./models/PengolahanLahan');
require('./models/Penanaman');
require('./models/PerawatanTanaman');
require('./models/Penyemprotan');
require('./models/Panen');

// Import Rute API
// Perhatikan path relatifnya dari app.js
const lahanRoutes = require('./routes/lahanRoutes');
const benihRoutes = require('./routes/benihRoutes');
const pupukRoutes = require('./routes/pupukRoutes');
const pestisidaRoutes = require('./routes/pestisidaRoutes');
const kebutuhanRoutes = require('./routes/kebutuhanRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // <--- PENTING: IMPOR INI HARUS ADA!

// Import Rute Kegiatan
const pengolahanLahanRoutes = require('./routes/pengolahanLahanRoutes');
const penanamanRoutes = require('./routes/penanamanRoutes');
const perawatanTanamanRoutes = require('./routes/perawatanTanamanRoutes'); // Typo sebelumnya: PerawatanTanasanRoutes
const penyemprotanRoutes = require('./routes/penyemprotanRoutes');
const panenRoutes = require('./routes/panenRoutes');

// Import Middleware
const { protect } = require('./middleware/authMiddleware');


const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB(); // connectDB akan mencoba koneksi menggunakan MONGO_URI dari process.env

// Middleware Express
app.use(cors()); // Mengizinkan permintaan lintas origin dari frontend
app.use(express.json()); // Mengizinkan Express untuk memparsing body permintaan sebagai JSON


// Rute Publik (Login)
app.use('/api/users', userRoutes);

// Rute yang Dilindungi dengan middleware 'protect'
app.use('/api/lahan', protect, lahanRoutes);
app.use('/api/benih', protect, benihRoutes);
app.use('/api/pupuk', protect, pupukRoutes);
app.use('/api/pestisida', protect, pestisidaRoutes);
app.use('/api/kebutuhan', protect, kebutuhanRoutes);

app.use('/api/kegiatan/pengolahan-lahan', protect, pengolahanLahanRoutes);
app.use('/api/kegiatan/penanaman', protect, penanamanRoutes);
app.use('/api/kegiatan/perawatan-tanaman', protect, perawatanTanamanRoutes);
app.use('/api/kegiatan/penyemprotan', protect, penyemprotanRoutes);
app.use('/api/kegiatan/panen', protect, panenRoutes);

app.use('/api/dashboard', protect, dashboardRoutes); // Ini rute dashboard


// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});