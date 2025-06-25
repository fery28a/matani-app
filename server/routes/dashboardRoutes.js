// server/routes/dashboardRoutes.js
const express = require('express');
const {
  getLatestSprayHistory,
  getTotalCostsPerLahan,
} = require('../controllers/dashboardController'); // Pastikan path ini benar

const router = express.Router();

router.get('/latest-spray', getLatestSprayHistory);
router.get('/total-costs-per-lahan', getTotalCostsPerLahan);

module.exports = router;