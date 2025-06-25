// server/routes/pupukRoutes.js
const express = require('express');
const {
  getPupuks,
  getPupukById,
  createPupuk,
  updatePupuk,
  deletePupuk,
} = require('../controllers/pupukController');

const router = express.Router();

router.route('/')
  .get(getPupuks)
  .post(createPupuk);

router.route('/:id')
  .get(getPupukById)
  .put(updatePupuk)
  .delete(deletePupuk);

module.exports = router;