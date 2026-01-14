const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');

// Dependency Injection: Create instances
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

/**
 * User Controller
 * Handles HTTP requests for user management
 */

/**
 * @route   GET /api/v1/users/profile
 * @desc    Get user profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.userId);
  
  res.status(200).json(
    ApiResponse.success(user, 'Profile retrieved successfully')
  );
});

/**
 * @route   PUT /api/v1/users/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const result = await userService.updateProfile(req.user.userId, req.body);
  
  res.status(200).json(
    ApiResponse.success(result.user, result.message)
  );
});

/**
 * @route   PUT /api/v1/users/change-password
 * @desc    Change user password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(
    req.user.userId,
    currentPassword,
    newPassword
  );
  
  res.status(200).json(
    ApiResponse.success(null, result.message)
  );
});

/**
 * @route   DELETE /api/v1/users/account
 * @desc    Deactivate user account
 * @access  Private
 */
const deactivateAccount = asyncHandler(async (req, res) => {
  const result = await userService.deactivateAccount(req.user.userId);
  
  res.status(200).json(
    ApiResponse.success(null, result.message)
  );
});

/**
 * @route   GET /api/v1/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await userService.getAllUsers({ page, limit });
  
  res.status(200).json(
    ApiResponse.successWithPagination(
      result.data,
      result.pagination,
      'Users retrieved successfully'
    )
  );
});

/**
 * @route   GET /api/v1/users/statistics
 * @desc    Get user statistics (admin only)
 * @access  Private/Admin
 */
const getUserStatistics = asyncHandler(async (req, res) => {
  const stats = await userService.getUserStatistics();
  
  res.status(200).json(
    ApiResponse.success(stats, 'Statistics retrieved successfully')
  );
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deactivateAccount,
  getAllUsers,
  getUserStatistics,
};
