const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const TaskService = require('../services/TaskService');
const TaskRepository = require('../repositories/TaskRepository');

// Dependency Injection: Create instances
const taskRepository = new TaskRepository();
const taskService = new TaskService(taskRepository);

/**
 * Task Controller
 * Handles HTTP requests for task management
 */

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Private
 */
const createTask = asyncHandler(async (req, res) => {
  const result = await taskService.createTask(req.user.userId, req.body);
  
  res.status(201).json(
    ApiResponse.created(result.task, result.message)
  );
});

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks for current user
 * @access  Private
 */
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, page, limit, sort } = req.query;
  
  const filters = { status, priority, search };
  const paginationOptions = { page, limit, sort };
  
  const result = await taskService.getUserTasks(
    req.user.userId,
    filters,
    paginationOptions
  );
  
  res.status(200).json(
    ApiResponse.successWithPagination(
      result.data,
      result.pagination,
      'Tasks retrieved successfully'
    )
  );
});

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get task by ID
 * @access  Private
 */
const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user.userId);
  
  res.status(200).json(
    ApiResponse.success(task, 'Task retrieved successfully')
  );
});

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update task
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  const result = await taskService.updateTask(
    req.params.id,
    req.user.userId,
    req.body
  );
  
  res.status(200).json(
    ApiResponse.success(result.task, result.message)
  );
});

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Delete task
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const result = await taskService.deleteTask(req.params.id, req.user.userId);
  
  res.status(200).json(
    ApiResponse.success(null, result.message)
  );
});

/**
 * @route   GET /api/v1/tasks/statistics/summary
 * @desc    Get task statistics
 * @access  Private
 */
const getTaskStatistics = asyncHandler(async (req, res) => {
  const stats = await taskService.getTaskStatistics(req.user.userId);
  
  res.status(200).json(
    ApiResponse.success(stats, 'Statistics retrieved successfully')
  );
});

/**
 * @route   GET /api/v1/tasks/overdue/list
 * @desc    Get overdue tasks
 * @access  Private
 */
const getOverdueTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getOverdueTasks(req.user.userId);
  
  res.status(200).json(
    ApiResponse.success(tasks, 'Overdue tasks retrieved successfully')
  );
});

/**
 * @route   GET /api/v1/tasks/upcoming/list
 * @desc    Get upcoming tasks
 * @access  Private
 */
const getUpcomingTasks = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const tasks = await taskService.getUpcomingTasks(req.user.userId, days);
  
  res.status(200).json(
    ApiResponse.success(tasks, 'Upcoming tasks retrieved successfully')
  );
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStatistics,
  getOverdueTasks,
  getUpcomingTasks,
};
