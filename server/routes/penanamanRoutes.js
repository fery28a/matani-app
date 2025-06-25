// server/routes/penanamanRoutes.js
const express = require('express');
const {
  getPenanamans,
  getPenanamanById,
  createPenanaman,
  updatePenanaman,
  deletePenanaman,
} = require('../controllers/penanamanController');

const router = express.Router();

router.route('/')
  .get(getPenanamans)
  .post(createPenanaman);

router.route('/:id')
  .get(getPenanamanById)
  .put(updatePenanaman)
  .delete(deletePenanaman);

module.exports = router;