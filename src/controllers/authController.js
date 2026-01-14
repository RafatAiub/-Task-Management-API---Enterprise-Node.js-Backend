const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');

// Dependency Injection: Create instances
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

/**
 * Authentication Controller
 * Handles HTTP requests for authentication
 */

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  
  res.status(201).json(
    ApiResponse.created(result, result.message)
  );
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  res.status(200).json(
    ApiResponse.success(result, result.message)
  );
});

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshToken(refreshToken);
  
  res.status(200).json(
    ApiResponse.success(result, 'Token refreshed successfully')
  );
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user.userId);
  
  res.status(200).json(
    ApiResponse.success(null, result.message)
  );
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await userRepository.findById(req.user.userId);
  
  res.status(200).json(
    ApiResponse.success(user, 'User retrieved successfully')
  );
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
};
