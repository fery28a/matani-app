// server/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token akan kedaluwarsa dalam 1 jam
  });
};

module.exports = generateToken;