const express = require('express');
const validate = require('../middleware/validateMiddleware');
const {
  getPublicProducts,
  getPublicProductById,
} = require('../controllers/productController');

const router = express.Router();

// Public routes don't need body validation since they use GET requests
// Path parameter validation is handled in controllers

router.get('/', getPublicProducts);
router.get('/:id', getPublicProductById);

module.exports = router;