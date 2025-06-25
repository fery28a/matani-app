// server/routes/lahanRoutes.js
const express = require('express');
const {
  getLahans,
  getLahanById,
  createLahan,
  updateLahan,
  deleteLahan,
  resetLahanData // <--- Import fungsi baru ini
} = require('../controllers/lahanController');

const router = express.Router();

router.route('/')
  .get(getLahans)
  .post(createLahan);

router.route('/:id')
  .get(getLahanById)
  .put(updateLahan)
  .delete(deleteLahan);

// Rute baru untuk reset data lahan dan semua terkaitnya
router.delete('/:id/reset', resetLahanData); // <--- TAMBAH BARIS INI

module.exports = router;