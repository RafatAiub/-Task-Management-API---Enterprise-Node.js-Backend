const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Validation Middleware Factory
 * Creates middleware to validate request data using Joi schemas
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Source of data to validate ('body', 'query', 'params')
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[source];

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown keys
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');

      throw new ApiError(
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        'Validation Error',
        errorMessage
      );
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

/**
 * Validate request body
 * @param {Object} schema - Joi schema
 */
const validateBody = (schema) => validate(schema, 'body');

/**
 * Validate query parameters
 * @param {Object} schema - Joi schema
 */
const validateQuery = (schema) => validate(schema, 'query');

/**
 * Validate URL parameters
 * @param {Object} schema - Joi schema
 */
const validateParams = (schema) => validate(schema, 'params');

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
};
