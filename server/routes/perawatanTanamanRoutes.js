// server/routes/perawatanTanamanRoutes.js
const express = require('express');
const {
  getPerawatanTanamans,
  getPerawatanTanamanById,
  createPerawatanTanaman,
  updatePerawatanTanaman,
  deletePerawatanTanaman,
} = require('../controllers/perawatanTanamanController');

const router = express.Router();

router.route('/')
  .get(getPerawatanTanamans)
  .post(createPerawatanTanaman);

router.route('/:id')
  .get(getPerawatanTanamanById)
  .put(updatePerawatanTanaman)
  .delete(deletePerawatanTanaman);

module.exports = router;