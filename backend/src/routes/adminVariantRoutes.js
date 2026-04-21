const express = require('express');
const { protectAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createVariant,
  getProductVariants,
  updateVariant,
  disableVariant,
} = require('../controllers/variantController');

const router = express.Router();

router.use(protectAdmin);

router.post(
  '/products/:productId/variants',
  validate({
    name: { required: true, type: 'string' },
    sku: { required: true, type: 'string' },
    price: { required: true, type: 'number' },
  }),
  createVariant
);

router.get('/products/:productId/variants', getProductVariants);

router.put('/variants/:id', updateVariant);
router.patch('/variants/:id/disable', disableVariant);

module.exports = router;