// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Untuk hashing password

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username harus diisi'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password harus diisi'],
    },
    role: { // Tambahkan role jika Anda ingin fitur otorisasi di masa depan
      type: String,
      enum: ['admin', 'user'], // Contoh role: admin, user
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// Middleware Mongoose: Hash password sebelum menyimpan user baru
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) { // Hanya hash jika password diubah atau baru
    next();
  }
  const salt = await bcrypt.genSalt(10); // Hasilkan salt
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});

// Metode untuk membandingkan password yang dimasukkan dengan password yang di-hash
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;