// server/routes/pengolahanLahanRoutes.js
const express = require('express');
const {
  getPengolahanLahans,
  getPengolahanLahanById,
  createPengolahanLahan,
  updatePengolahanLahan,
  deletePengolahanLahan,
} = require('../controllers/pengolahanLahanController');

const router = express.Router();

router.route('/')
  .get(getPengolahanLahans)
  .post(createPengolahanLahan);

router.route('/:id')
  .get(getPengolahanLahanById)
  .put(updatePengolahanLahan)
  .delete(deletePengolahanLahan);

module.exports = router;