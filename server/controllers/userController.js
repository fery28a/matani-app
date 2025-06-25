// server/controllers/userController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Username atau password salah' });
    }
  } catch (error) {
    console.error('Error in authUser:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server saat login', error: error.message });
  }
};

// @desc    Add new user (Admin Only) - NO PUBLIC REGISTER ROUTE
// This function would typically be called from an admin panel, or via seed script
// @route   POST /api/users/add (or similar, not exposed to public)
// @access  Private (Admin)
// We won't create a public frontend for this, just backend logic.
const addUser = async (username, password, role = 'user') => {
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log(`User ${username} already exists.`);
      return null;
    }

    const user = await User.create({ username, password, role });
    console.log(`User ${user.username} with role ${user.role} added successfully.`);
    return user;
  } catch (error) {
    console.error('Error adding user:', error);
    return null;
  }
};


module.exports = {
  authUser,
  addUser // Export this if you want to use it in a seed script
};