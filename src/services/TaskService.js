const { ERROR_MESSAGES, SUCCESS_MESSAGES, PAGINATION } = require('../config/constants');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Task Service
 * Handles all task-related business logic
 * Implements Dependency Injection pattern
 */
class TaskService {
  /**
   * Constructor with Dependency Injection
   * @param {TaskRepository} taskRepository - Injected task repository
   */
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  /**
   * Create a new task
   * @param {string} userId - User ID
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>}
   */
  async createTask(userId, taskData) {
    try {
      const task = await this.taskRepository.create({
        ...taskData,
        user: userId,
      });

      logger.info(`Task created: ${task._id} by user: ${userId}`);

      return {
        task,
        message: SUCCESS_MESSAGES.CREATED,
      };
    } catch (error) {
      logger.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Get all tasks for a user with filters
   * @param {string} userId - User ID
   * @param {Object} filters - Filter criteria
   * @param {Object} paginationOptions - Pagination options
   * @returns {Promise<Object>}
   */
  async getUserTasks(userId, filters = {}, paginationOptions = {}) {
    try {
      // Build filter criteria
      const criteria = {};

      if (filters.status) {
        criteria.status = filters.status;
      }

      if (filters.priority) {
        criteria.priority = filters.priority;
      }

      if (filters.search) {
        const regex = new RegExp(filters.search, 'i');
        criteria.$or = [
          { title: regex },
          { description: regex },
        ];
      }

      // Set pagination defaults
      const options = {
        page: parseInt(paginationOptions.page) || PAGINATION.DEFAULT_PAGE,
        limit: Math.min(
          parseInt(paginationOptions.limit) || PAGINATION.DEFAULT_LIMIT,
          PAGINATION.MAX_LIMIT
        ),
        sort: paginationOptions.sort || { createdAt: -1 },
      };

      const result = await this.taskRepository.findByUserWithFilters(
        userId,
        criteria,
        options
      );

      return result;
    } catch (error) {
      logger.error('Error getting user tasks:', error);
      throw error;
    }
  }

  /**
   * Get task by ID
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>}
   */
  async getTaskById(taskId, userId) {
    try {
      const task = await this.taskRepository.findByIdAndUser(taskId, userId);

      if (!task) {
        throw new ApiError(404, ERROR_MESSAGES.NOT_FOUND, 'Task not found');
      }

      return task;
    } catch (error) {
      logger.error('Error getting task by ID:', error);
      throw error;
    }
  }

  /**
   * Update task
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID (for authorization)
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>}
   */
  async updateTask(taskId, userId, updateData) {
    try {
      // Verify task exists and belongs to user
      const existingTask = await this.taskRepository.findByIdAndUser(taskId, userId);

      if (!existingTask) {
        throw new ApiError(404, ERROR_MESSAGES.NOT_FOUND, 'Task not found');
      }

      // Update task
      const task = await this.taskRepository.updateById(taskId, updateData);

      logger.info(`Task updated: ${taskId} by user: ${userId}`);

      return {
        task,
        message: SUCCESS_MESSAGES.UPDATED,
      };
    } catch (error) {
      logger.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Delete task (soft delete)
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>}
   */
  async deleteTask(taskId, userId) {
    try {
      const task = await this.taskRepository.softDelete(taskId, userId);

      if (!task) {
        throw new ApiError(404, ERROR_MESSAGES.NOT_FOUND, 'Task not found');
      }

      logger.info(`Task deleted: ${taskId} by user: ${userId}`);

      return {
        message: SUCCESS_MESSAGES.DELETED,
      };
    } catch (error) {
      logger.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Get task statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  async getTaskStatistics(userId) {
    try {
      const stats = await this.taskRepository.getStatistics(userId);
      return stats;
    } catch (error) {
      logger.error('Error getting task statistics:', error);
      throw error;
    }
  }

  /**
   * Get overdue tasks for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>}
   */
  async getOverdueTasks(userId) {
    try {
      const tasks = await this.taskRepository.findOverdueTasks(userId);
      return tasks;
    } catch (error) {
      logger.error('Error getting overdue tasks:', error);
      throw error;
    }
  }

  /**
   * Get upcoming tasks for a user
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look ahead
   * @returns {Promise<Array>}
   */
  async getUpcomingTasks(userId, days = 7) {
    try {
      const tasks = await this.taskRepository.findUpcomingTasks(userId, days);
      return tasks;
    } catch (error) {
      logger.error('Error getting upcoming tasks:', error);
      throw error;
    }
  }
}

module.exports = TaskService;
