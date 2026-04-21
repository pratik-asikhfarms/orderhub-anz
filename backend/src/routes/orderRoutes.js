const express = require('express');
const validate = require('../middleware/validateMiddleware');
const { createOrder } = require('../controllers/orderController');

const router = express.Router();

const createOrderSchema = {
  customerName: { required: true, type: 'string' },
  customerEmail: { required: true, type: 'string' },
  customerPhone: { required: true, type: 'string' },
  addressLine1: { required: true, type: 'string' },
  addressLine2: { required: false, type: 'string' },
  city: { required: true, type: 'string' },
  state: { required: false, type: 'string' },
  postalCode: { required: true, type: 'string' },
  country: { required: false, type: 'string' },
  notes: { required: false, type: 'string' },
  items: { required: true, type: 'array' },
};

router.post('/', validate(createOrderSchema), createOrder);

module.exports = router;