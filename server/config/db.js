const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables dari .env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
};

module.exports = connectDB;