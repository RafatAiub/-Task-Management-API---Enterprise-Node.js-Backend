const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const { ERROR_MESSAGES } = require('../config/constants');
const asyncHandler = require('../utils/asyncHandler');
const UserRepository = require('../repositories/UserRepository');

const userRepository = new UserRepository();

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = asyncHandler(async (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, ERROR_MESSAGES.UNAUTHORIZED, 'No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, ERROR_MESSAGES.UNAUTHORIZED, 'User not found');
    }

    if (!user.isActive) {
      throw new ApiError(403, ERROR_MESSAGES.FORBIDDEN, 'Account is deactivated');
    }

    // Attach user to request
    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, ERROR_MESSAGES.INVALID_TOKEN);
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, ERROR_MESSAGES.TOKEN_EXPIRED);
    }
    throw error;
  }
});

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't throw error if not
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userRepository.findById(decoded.userId);

    if (user && user.isActive) {
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
      };
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
});

module.exports = {
  authenticate,
  optionalAuth,
};
