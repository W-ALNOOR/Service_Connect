const express = require('express');
const router = express.Router();

const {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} = require('../controllers/service.controller.js');

const { requireAuth } = require('../middleware/auth');

router.get('/', getServices);
router.get('/:id', getServiceById);

router.post('/', requireAuth, createService);
router.put('/:id', requireAuth, updateService);
router.delete('/:id', requireAuth, deleteService);

module.exports = router;
