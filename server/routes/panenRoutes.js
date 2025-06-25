// server/routes/panenRoutes.js
const express = require('express');
const {
  getPanens,
  getPanenById,
  createPanen,
  updatePanen,
  deletePanen,
} = require('../controllers/panenController');

const router = express.Router();

router.route('/')
  .get(getPanens)
  .post(createPanen);

router.route('/:id')
  .get(getPanenById)
  .put(updatePanen)
  .delete(deletePanen);

module.exports = router;