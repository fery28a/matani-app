// server/routes/kebutuhanRoutes.js
const express = require('express');
const {
  getKebutuhans,
  getKebutuhanById,
  createKebutuhan,
  updateKebutuhan,
  deleteKebutuhan,
} = require('../controllers/kebutuhanController');

const router = express.Router();

router.route('/')
  .get(getKebutuhans)
  .post(createKebutuhan);

router.route('/:id')
  .get(getKebutuhanById)
  .put(updateKebutuhan)
  .delete(deleteKebutuhan);

module.exports = router;