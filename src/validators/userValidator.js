const Joi = require('joi');

/**
 * User Validation Schemas
 */

/**
 * Update profile validation schema
 */
const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters',
    }),
});

/**
 * Change password validation schema
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Current password is required',
    }),
  
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 8 characters',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
});

/**
 * User ID parameter validation
 */
const userIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
    }),
});

module.exports = {
  updateProfileSchema,
  changePasswordSchema,
  userIdParamSchema,
};
