const express = require('express');
const validate = require('../middleware/validateMiddleware');
const { loginAdmin } = require('../controllers/adminAuthController');

const router = express.Router();

const loginSchema = {
  email: { required: true, type: 'string' },
  password: { required: true, type: 'string' },
};

router.post('/login', validate(loginSchema), loginAdmin);

module.exports = router;