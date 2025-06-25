// server/routes/userRoutes.js
const express = require('express');
const { authUser } = require('../controllers/userController'); // Hanya import authUser

const router = express.Router();

router.post('/login', authUser); // Rute untuk login

module.exports = router;