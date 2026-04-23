const express = require('express');
const validate = require('../middleware/validateMiddleware');
const { protectAdmin } = require('../middleware/authMiddleware');
const {
  createProduct,
  getAdminProducts,
  updateProduct,
  disableProduct,
  updateProductStatus,
  updateVariantStatus,
} = require('../controllers/productController');

const router = express.Router();

router.use(protectAdmin);

const createProductSchema = {
  name: { required: true, type: 'string' },
  description: { required: false, type: 'string' },
  imageUrl: { required: false, type: 'string' },
  isActive: { required: false, type: 'boolean' },
};

const updateProductSchema = {
  name: { required: false, type: 'string' },
  description: { required: false, type: 'string' },
  imageUrl: { required: false, type: 'string' },
  isActive: { required: false, type: 'boolean' },
};

router.post('/products', validate(createProductSchema), createProduct);
router.get('/products', getAdminProducts);
router.put('/products/:id', validate(updateProductSchema), updateProduct);
router.patch('/products/:id/disable', disableProduct);
router.patch('/products/:id/status', updateProductStatus);
router.patch('/products/variants/:id/status', updateVariantStatus);

module.exports = router;