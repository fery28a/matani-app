// server/routes/benihRoutes.js
const express = require('express');
const {
  getBenihs,
  getBenihById,
  createBenih,
  updateBenih,
  deleteBenih,
} = require('../controllers/benihController');

const router = express.Router();

router.route('/')
  .get(getBenihs)
  .post(createBenih);

router.route('/:id')
  .get(getBenihById)
  .put(updateBenih)
  .delete(deleteBenih);

module.exports = router;