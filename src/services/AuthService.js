const jwt = require('jsonwebtoken');
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Authentication Service
 * Handles all authentication-related business logic
 * Implements Dependency Injection pattern
 */
class AuthService {
  /**
   * Constructor with Dependency Injection
   * @param {UserRepository} userRepository - Injected user repository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - User and tokens
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      
      if (existingUser) {
        throw new ApiError(409, ERROR_MESSAGES.DUPLICATE_ENTRY, 'Email already registered');
      }

      // Create new user
      const user = await this.userRepository.create(userData);

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token
      await this.userRepository.updateRefreshToken(user._id, refreshToken);

      // Update last login
      await this.userRepository.updateLastLogin(user._id);

      logger.info(`User registered successfully: ${user.email}`);

      return {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken,
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - User and tokens
   */
  async login(email, password) {
    try {
      // Find user with password
      const user = await this.userRepository.findByEmail(email, true);

      if (!user) {
        throw new ApiError(401, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new ApiError(403, ERROR_MESSAGES.FORBIDDEN, 'Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new ApiError(401, ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token
      await this.userRepository.updateRefreshToken(user._id, refreshToken);

      // Update last login
      await this.userRepository.updateLastLogin(user._id);

      logger.info(`User logged in successfully: ${user.email}`);

      return {
        user: this.sanitizeUser(user),
        accessToken,
        refreshToken,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} - New access token
   */
  async refreshToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Find user
      const user = await this.userRepository.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new ApiError(401, ERROR_MESSAGES.INVALID_TOKEN);
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user);

      logger.info(`Token refreshed for user: ${user.email}`);

      return {
        accessToken,
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, ERROR_MESSAGES.INVALID_TOKEN);
      }
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, ERROR_MESSAGES.TOKEN_EXPIRED);
      }
      throw error;
    }
  }

  /**
   * Logout user
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  async logout(userId) {
    try {
      // Clear refresh token
      await this.userRepository.updateRefreshToken(userId, null);

      logger.info(`User logged out: ${userId}`);

      return {
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      };
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Generate JWT access token
   * @param {Object} user - User object
   * @returns {string} - JWT token
   */
  generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );
  }

  /**
   * Generate JWT refresh token
   * @param {Object} user - User object
   * @returns {string} - JWT refresh token
   */
  generateRefreshToken(user) {
    return jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
      }
    );
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} - Decoded token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, ERROR_MESSAGES.INVALID_TOKEN);
      }
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, ERROR_MESSAGES.TOKEN_EXPIRED);
      }
      throw error;
    }
  }

  /**
   * Sanitize user object (remove sensitive data)
   * @param {Object} user - User object
   * @returns {Object} - Sanitized user
   */
  sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    delete userObj.refreshToken;
    return userObj;
  }
}

module.exports = AuthService;
