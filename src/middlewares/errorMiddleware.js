const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Error handling middleware
 * Catches all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Convert non-ApiError errors to ApiError
  if (!(error instanceof ApiError)) {
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map(e => e.message)
        .join(', ');
      error = new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation Error', message);
    }
    // Mongoose duplicate key error
    else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      error = new ApiError(
        HTTP_STATUS.CONFLICT,
        'Duplicate Entry',
        `${field} already exists`
      );
    }
    // Mongoose cast error (invalid ObjectId)
    else if (error.name === 'CastError') {
      error = new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid ID format');
    }
    // JWT errors
    else if (error.name === 'JsonWebTokenError') {
      error = new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid token');
    }
    else if (error.name === 'TokenExpiredError') {
      error = new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Token expired');
    }
    // Generic error
    else {
      error = new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'Internal Server Error',
        process.env.NODE_ENV === 'development' ? err.message : ''
      );
    }
  }

  // Send error response
  res.status(error.statusCode).json(error.toJSON());
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    HTTP_STATUS.NOT_FOUND,
    'Route not found',
    `Cannot ${req.method} ${req.originalUrl}`
  );
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
