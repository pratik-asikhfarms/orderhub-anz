const express = require('express');
const validate = require('../middleware/validateMiddleware');
const { protectAdmin } = require('../middleware/authMiddleware');
const {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.use(protectAdmin);

const updateOrderStatusSchema = {
  status: { required: true, type: 'string' },
};

// GET routes don't need body validation
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

module.exports = router;