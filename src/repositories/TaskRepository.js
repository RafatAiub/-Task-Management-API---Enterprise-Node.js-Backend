const BaseRepository = require('./BaseRepository');
const Task = require('../models/Task');
const { TASK_STATUS } = require('../config/constants');

/**
 * Task Repository
 * Handles all database operations for Task model
 * Extends BaseRepository for common CRUD operations
 */
class TaskRepository extends BaseRepository {
  constructor() {
    super(Task);
  }

  /**
   * Find tasks by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Task[]>}
   */
  async findByUser(userId, options = {}) {
    try {
      return await this.find(
        { user: userId, isDeleted: false },
        options
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find tasks by user with filters and pagination
   * @param {string} userId - User ID
   * @param {Object} filters - Filter criteria (status, priority, etc.)
   * @param {Object} paginationOptions - Pagination options
   * @returns {Promise<Object>}
   */
  async findByUserWithFilters(userId, filters = {}, paginationOptions = {}) {
    try {
      const criteria = {
        user: userId,
        isDeleted: false,
        ...filters,
      };

      return await this.findWithPagination(criteria, {
        ...paginationOptions,
        sort: paginationOptions.sort || { createdAt: -1 },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find task by ID and user (for authorization)
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID
   * @returns {Promise<Task|null>}
   */
  async findByIdAndUser(taskId, userId) {
    try {
      return await this.findOne({
        _id: taskId,
        user: userId,
        isDeleted: false,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find overdue tasks for a user
   * @param {string} userId - User ID
   * @returns {Promise<Task[]>}
   */
  async findOverdueTasks(userId) {
    try {
      return await this.find({
        user: userId,
        isDeleted: false,
        status: { $ne: TASK_STATUS.COMPLETED },
        dueDate: { $lt: new Date() },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find upcoming tasks (due within specified days)
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look ahead
   * @returns {Promise<Task[]>}
   */
  async findUpcomingTasks(userId, days = 7) {
    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      return await this.find({
        user: userId,
        isDeleted: false,
        status: { $ne: TASK_STATUS.COMPLETED },
        dueDate: {
          $gte: now,
          $lte: futureDate,
        },
      }, {
        sort: { dueDate: 1 },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Soft delete task
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Task|null>}
   */
  async softDelete(taskId, userId) {
    try {
      return await this.updateOne(
        { _id: taskId, user: userId, isDeleted: false },
        { isDeleted: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update task status
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID
   * @param {string} status - New status
   * @returns {Promise<Task|null>}
   */
  async updateStatus(taskId, userId, status) {
    try {
      return await this.updateOne(
        { _id: taskId, user: userId, isDeleted: false },
        { status }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get task statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  async getStatistics(userId) {
    try {
      const [
        total,
        pending,
        inProgress,
        completed,
        cancelled,
        overdue,
      ] = await Promise.all([
        this.count({ user: userId, isDeleted: false }),
        this.count({ user: userId, isDeleted: false, status: TASK_STATUS.PENDING }),
        this.count({ user: userId, isDeleted: false, status: TASK_STATUS.IN_PROGRESS }),
        this.count({ user: userId, isDeleted: false, status: TASK_STATUS.COMPLETED }),
        this.count({ user: userId, isDeleted: false, status: TASK_STATUS.CANCELLED }),
        this.count({
          user: userId,
          isDeleted: false,
          status: { $ne: TASK_STATUS.COMPLETED },
          dueDate: { $lt: new Date() },
        }),
      ]);

      return {
        total,
        byStatus: {
          pending,
          inProgress,
          completed,
          cancelled,
        },
        overdue,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search tasks by title or description
   * @param {string} userId - User ID
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Promise<Task[]>}
   */
  async searchTasks(userId, searchTerm, options = {}) {
    try {
      const regex = new RegExp(searchTerm, 'i');
      
      return await this.find({
        user: userId,
        isDeleted: false,
        $or: [
          { title: regex },
          { description: regex },
        ],
      }, options);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskRepository;
