const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/constants');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * User Service
 * Handles all user-related business logic
 * Implements Dependency Injection pattern
 */
class UserService {
  /**
   * Constructor with Dependency Injection
   * @param {UserRepository} userRepository - Injected user repository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new ApiError(404, ERROR_MESSAGES.NOT_FOUND, 'User not found');
      }

      return user;
    } catch (error) {
      logger.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, updateData) {
    try {
      // Prevent updating sensitive fields
      const allowedFields = ['name'];
      const filteredData = {};

      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });

      const user = await this.userRepository.updateById(userId, filteredData);

      if (!user) {
        throw new ApiError(404, ERROR_MESSAGES.NOT_FOUND, 'User not found');
      }

      logger.info(`User profile updated: ${userId}`);

      return {
        user,
        message: SUCCESS_MESSAGES.UPDATED,
      };
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>}
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await this.userRepository.findByIdWithPassword(userId);

      if (!user) {
        throw new ApiError(404, ERROR_MESSAGES.NOT_FOUND, 'User not found');
      }

      // Verify current password
      const isPasswordValid = await user.comparePassword(currentPassword);

      if (!isPasswordValid) {
        throw new ApiError(401, ERROR_MESSAGES.INVALID_CREDENTIALS, 'Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${userId}`);

      return {
        message: 'Password changed successfully',
      };
    } catch (error) {
      logger.error('Error changing password:', error);
      throw error;
    }
  }

  /**
   * Deactivate user account
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  async deactivateAccount(userId) {
    try {
      const user = await this.userRepository.deactivateUser(userId);

      if (!user) {
        throw new ApiError(404, ERROR_MESSAGES.NOT_FOUND, 'User not found');
      }

      logger.info(`User account deactivated: ${userId}`);

      return {
        message: 'Account deactivated successfully',
      };
    } catch (error) {
      logger.error('Error deactivating account:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   * @param {Object} options - Query options
   * @returns {Promise<Object>}
   */
  async getAllUsers(options = {}) {
    try {
      const result = await this.userRepository.findWithPagination({}, options);
      return result;
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Get user statistics (admin only)
   * @returns {Promise<Object>}
   */
  async getUserStatistics() {
    try {
      const stats = await this.userRepository.getStatistics();
      return stats;
    } catch (error) {
      logger.error('Error getting user statistics:', error);
      throw error;
    }
  }
}

module.exports = UserService;
