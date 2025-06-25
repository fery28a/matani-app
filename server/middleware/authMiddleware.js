// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Pastikan model User diimpor

const protect = async (req, res, next) => {
  let token;

  // Periksa apakah ada header Authorization dan dimulai dengan 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ambil token dari header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];
      console.log('Middleware Protect: Token diterima:', token ? token.substring(0, 30) + '...' : 'Tidak ada token'); // Log token yang diterima (potong untuk keamanan)

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Middleware Protect: Token berhasil didekode:', decoded); // Log hasil decode

      // Cari user berdasarkan ID dari token yang didekode dan lampirkan ke objek request
      // .select('-password') berarti tidak menyertakan password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.error('Middleware Protect: User tidak ditemukan untuk ID token:', decoded.id);
        return res.status(401).json({ message: 'Tidak terotorisasi, user token tidak ditemukan' });
      }

      console.log('Middleware Protect: User terotentikasi:', req.user.username); // Log user yang ditemukan
      next(); // Lanjutkan ke controller selanjutnya
    } catch (error) {
      // Tangani error verifikasi JWT (misalnya, token tidak valid, kedaluwarsa)
      console.error('Middleware Protect: Error saat verifikasi token:', error.message);
      if (error.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Tidak terotorisasi, token kedaluwarsa. Mohon login kembali.' });
      } else if (error.name === 'JsonWebTokenError') {
        res.status(401).json({ message: 'Tidak terotorisasi, token tidak valid. Mohon login kembali.' });
      } else {
        res.status(401).json({ message: 'Tidak terotorisasi, token gagal. Mohon login kembali.' });
      }
    }
  } else {
    // Jika tidak ada token di header
    console.log('Middleware Protect: Tidak ada token ditemukan di header Authorization.');
    res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token' });
  }
};

// Middleware untuk otorisasi admin
const admin = (req, res, next) => {
  // Asumsi req.user sudah ada dari middleware protect
  if (req.user && req.user.role === 'admin') {
    console.log(`Middleware Admin: User ${req.user.username} adalah admin.`);
    next();
  } else {
    console.warn(`Middleware Admin: Akses ditolak untuk user ${req.user ? req.user.username : 'tidak dikenal'} (bukan admin).`);
    res.status(403).json({ message: 'Tidak diizinkan, hanya untuk admin' }); // 403 Forbidden
  }
};

module.exports = { protect, admin };