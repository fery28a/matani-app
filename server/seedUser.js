// server/seedUser.js
const connectDB = require('./config/db');
const { addUser } = require('./controllers/userController'); // Import addUser
require('dotenv').config({ path: './.env' }); // Pastikan .env diload

const seed = async () => {
  await connectDB(); // Koneksi ke database
  console.log('--- Menambahkan user awal ---');
  await addUser('admin', 'password123', 'admin'); // Username: admin, Password: password123, Role: admin
  await addUser('petani', 'pass123', 'user');    // Username: petani, Password: pass123, Role: user
  console.log('--- Penambahan user selesai ---');
  process.exit(); // Keluar dari proses setelah selesai
};

seed();