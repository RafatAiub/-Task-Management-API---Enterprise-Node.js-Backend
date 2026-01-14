const Joi = require('joi');
const { TASK_STATUS, TASK_PRIORITY } = require('../config/constants');

/**
 * Task Validation Schemas
 */

/**
 * Create task validation schema
 */
const createTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Task title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 100 characters',
    }),
  
  description: Joi.string()
    .max(500)
    .trim()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
  
  status: Joi.string()
    .valid(...Object.values(TASK_STATUS))
    .messages({
      'any.only': `Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`,
    }),
  
  priority: Joi.string()
    .valid(...Object.values(TASK_PRIORITY))
    .messages({
      'any.only': `Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`,
    }),
  
  dueDate: Joi.date()
    .iso()
    .min('now')
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.min': 'Due date must be in the future',
    }),
  
  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .messages({
      'array.base': 'Tags must be an array',
    }),
});

/**
 * Update task validation schema
 */
const updateTaskSchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(100)
    .trim()
    .messages({
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 100 characters',
    }),
  
  description: Joi.string()
    .max(500)
    .trim()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 500 characters',
    }),
  
  status: Joi.string()
    .valid(...Object.values(TASK_STATUS))
    .messages({
      'any.only': `Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`,
    }),
  
  priority: Joi.string()
    .valid(...Object.values(TASK_PRIORITY))
    .messages({
      'any.only': `Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`,
    }),
  
  dueDate: Joi.date()
    .iso()
    .messages({
      'date.base': 'Due date must be a valid date',
    }),
  
  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .messages({
      'array.base': 'Tags must be an array',
    }),
}).min(1); // At least one field must be provided

/**
 * Task query parameters validation
 */
const taskQuerySchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TASK_STATUS))
    .messages({
      'any.only': `Status must be one of: ${Object.values(TASK_STATUS).join(', ')}`,
    }),
  
  priority: Joi.string()
    .valid(...Object.values(TASK_PRIORITY))
    .messages({
      'any.only': `Priority must be one of: ${Object.values(TASK_PRIORITY).join(', ')}`,
    }),
  
  search: Joi.string()
    .trim()
    .allow('')
    .messages({
      'string.base': 'Search must be a string',
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be at least 1',
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
    }),
  
  sort: Joi.string()
    .valid('createdAt', '-createdAt', 'dueDate', '-dueDate', 'priority', '-priority')
    .default('-createdAt')
    .messages({
      'any.only': 'Invalid sort field',
    }),
});

/**
 * Task ID parameter validation
 */
const taskIdParamSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid task ID format',
    }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdParamSchema,
};
