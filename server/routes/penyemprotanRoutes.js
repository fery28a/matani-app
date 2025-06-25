// server/routes/penyemprotanRoutes.js
const express = require('express');
const {
  getPenyemprotans,
  getPenyemprotanById,
  createPenyemprotan,
  updatePenyemprotan,
  deletePenyemprotan,
} = require('../controllers/penyemprotanController');

const router = express.Router();

router.route('/')
  .get(getPenyemprotans)
  .post(createPenyemprotan);

router.route('/:id')
  .get(getPenyemprotanById)
  .put(updatePenyemprotan)
  .delete(deletePenyemprotan);

module.exports = router;