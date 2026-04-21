const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const errors = {};

  for (const field in schema) {
    const value = req.body[field];
    const rules = schema[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${field} is required`;
      continue;
    }

    if (value !== undefined) {
      if (rules.type === 'number' && isNaN(Number(value))) {
        errors[field] = `${field} must be a number`;
      }

      if (rules.type === 'string' && typeof value !== 'string') {
        errors[field] = `${field} must be a string`;
      }

      if (rules.type === 'array' && !Array.isArray(value)) {
        errors[field] = `${field} must be an array`;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed', errors));
  }

  next();
};

module.exports = validate;