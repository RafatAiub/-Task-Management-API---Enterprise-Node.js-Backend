const ApiError = require('../utils/ApiError');
const { ERROR_MESSAGES, USER_ROLES } = require('../config/constants');

/**
 * Role-based authorization middleware
 * Checks if user has required role(s)
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        ERROR_MESSAGES.FORBIDDEN,
        'You do not have permission to access this resource'
      );
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const isAdmin = authorize(USER_ROLES.ADMIN);

/**
 * Check if user is regular user
 */
const isUser = authorize(USER_ROLES.USER);

/**
 * Check if user is admin or the resource owner
 * @param {Function} getResourceUserId - Function to extract user ID from resource
 */
const isAdminOrOwner = (getResourceUserId) => {
  return async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Admin can access everything
    if (req.user.role === USER_ROLES.ADMIN) {
      return next();
    }

    // Get resource user ID
    const resourceUserId = await getResourceUserId(req);

    // Check if user owns the resource
    if (req.user.userId.toString() !== resourceUserId.toString()) {
      throw new ApiError(
        403,
        ERROR_MESSAGES.FORBIDDEN,
        'You can only access your own resources'
      );
    }

    next();
  };
};

module.exports = {
  authorize,
  isAdmin,
  isUser,
  isAdminOrOwner,
};
