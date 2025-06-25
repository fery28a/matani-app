// server/routes/pestisidaRoutes.js
const express = require('express');
const {
  getPestisidas,
  getPestisidaById,
  createPestisida,
  updatePestisida,
  deletePestisida,
} = require('../controllers/pestisidaController');

const router = express.Router();

router.route('/')
  .get(getPestisidas)
  .post(createPestisida);

router.route('/:id')
  .get(getPestisidaById)
  .put(updatePestisida)
  .delete(deletePestisida);

module.exports = router;