const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

/**
 * User Repository
 * Handles all database operations for User model
 * Extends BaseRepository for common CRUD operations
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @param {boolean} includePassword - Whether to include password field
   * @returns {Promise<User|null>}
   */
  async findByEmail(email, includePassword = false) {
    try {
      let query = this.model.findOne({ email: email.toLowerCase() });
      
      if (includePassword) {
        query = query.select('+password');
      }
      
      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by ID with password
   * @param {string} id - User ID
   * @returns {Promise<User|null>}
   */
  async findByIdWithPassword(id) {
    try {
      return await this.model.findById(id).select('+password');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all active users
   * @param {Object} options - Query options
   * @returns {Promise<User[]>}
   */
  async findActiveUsers(options = {}) {
    try {
      return await this.find({ isActive: true }, options);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user's last login timestamp
   * @param {string} userId - User ID
   * @returns {Promise<User|null>}
   */
  async updateLastLogin(userId) {
    try {
      return await this.updateById(userId, { lastLogin: new Date() });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user's refresh token
   * @param {string} userId - User ID
   * @param {string} refreshToken - New refresh token
   * @returns {Promise<User|null>}
   */
  async updateRefreshToken(userId, refreshToken) {
    try {
      return await this.updateById(userId, { refreshToken });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deactivate user account
   * @param {string} userId - User ID
   * @returns {Promise<User|null>}
   */
  async deactivateUser(userId) {
    try {
      return await this.updateById(userId, { isActive: false });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Activate user account
   * @param {string} userId - User ID
   * @returns {Promise<User|null>}
   */
  async activateUser(userId) {
    try {
      return await this.updateById(userId, { isActive: true });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>}
   */
  async emailExists(email) {
    try {
      return await this.exists({ email: email.toLowerCase() });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    try {
      const [total, active, inactive, admins, users] = await Promise.all([
        this.count(),
        this.count({ isActive: true }),
        this.count({ isActive: false }),
        this.count({ role: 'admin' }),
        this.count({ role: 'user' }),
      ]);

      return {
        total,
        active,
        inactive,
        admins,
        users,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;
