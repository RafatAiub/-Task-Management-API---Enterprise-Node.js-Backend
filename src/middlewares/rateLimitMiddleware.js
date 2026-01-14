const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../config/constants');

/**
 * General API rate limiter
 * Limits requests from a single IP
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    const error = new ApiError(
      HTTP_STATUS.TOO_MANY_REQUESTS || 429,
      'Too Many Requests',
      'You have exceeded the rate limit. Please try again later.'
    );
    res.status(error.statusCode).json(error.toJSON());
  },
});

/**
 * Strict rate limiter for authentication routes
 * Prevents brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: 'Too many authentication attempts, please try again later',
  handler: (req, res) => {
    const error = new ApiError(
      HTTP_STATUS.TOO_MANY_REQUESTS || 429,
      'Too Many Requests',
      'Too many authentication attempts. Please try again after 15 minutes.'
    );
    res.status(error.statusCode).json(error.toJSON());
  },
});

/**
 * Create custom rate limiter
 * @param {Object} options - Rate limit options
 */
const createRateLimiter = (options) => {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const error = new ApiError(
        HTTP_STATUS.TOO_MANY_REQUESTS || 429,
        'Too Many Requests',
        'Rate limit exceeded'
      );
      res.status(error.statusCode).json(error.toJSON());
    },
    ...options,
  });
};

module.exports = {
  apiLimiter,
  authLimiter,
  createRateLimiter,
};
