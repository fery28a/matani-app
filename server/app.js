// server/app.js
const path = require('path'); 
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

// Debugging log (bisa dihapus setelah yakin deploy sukses)
console.log('Node.js CWD:', process.cwd());
console.log('Node.js __dirname:', __dirname);
console.log('Absolute path to .env:', path.resolve(__dirname, '../.env'));
console.log('MONGO_URI from process.env:', process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 30) + '...' : "MONGO_URI is undefined (from app.js)");
console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 30) + '...' : "JWT_SECRET is undefined (from app.js)");


const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 


// Hapus semua require('./models/User'); dan require('./models/...') yang tidak lagi digunakan oleh Mongoose
require('./models/Lahan');
require('./models/Pupuk');
require('./models/Pestisida');
require('./models/Kebutuhan');
require('./models/Benih');
// require('./models/User'); // <--- HAPUS BARIS INI

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
// const userRoutes = require('./routes/userRoutes'); // <--- HAPUS BARIS INI
const dashboardRoutes = require('./routes/dashboardRoutes'); 

// Import Rute Kegiatan
const pengolahanLahanRoutes = require('./routes/pengolahanLahanRoutes');
const penanamanRoutes = require('./routes/penanamanRoutes');
const perawatanTanamanRoutes = require('./routes/perawatanTanamanRoutes'); 
const penyemprotanRoutes = require('./routes/penyemprotanRoutes');
const panenRoutes = require('./routes/panenRoutes');

// Hapus import Middleware
// const { protect } = require('./middleware/authMiddleware'); // <--- HAPUS BARIS INI


const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB(); 

// Middleware Express
app.use(cors()); 
app.use(express.json()); 


// Hapus Rute Publik (Login)
// app.use('/api/users', userRoutes); // <--- HAPUS BARIS INI

// Hapus middleware 'protect' dari semua rute
app.use('/api/lahan', lahanRoutes); // <--- HAPUS 'protect'
app.use('/api/benih', benihRoutes); // <--- HAPUS 'protect'
app.use('/api/pupuk', pupukRoutes); // <--- HAPUS 'protect'
app.use('/api/pestisida', pestisidaRoutes); // <--- HAPUS 'protect'
app.use('/api/kebutuhan', kebutuhanRoutes); // <--- HAPUS 'protect'

app.use('/api/kegiatan/pengolahan-lahan', pengolahanLahanRoutes); // <--- HAPUS 'protect'
app.use('/api/kegiatan/penanaman', penanamanRoutes);             // <--- HAPUS 'protect'
app.use('/api/kegiatan/perawatan-tanaman', perawatanTanamanRoutes); // <--- HAPUS 'protect'
app.use('/api/kegiatan/penyemprotan', penyemprotanRoutes);       // <--- HAPUS 'protect'
app.use('/api/kegiatan/panen', panenRoutes);                     // <--- HAPUS 'protect'

app.use('/api/dashboard', dashboardRoutes); 


// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});