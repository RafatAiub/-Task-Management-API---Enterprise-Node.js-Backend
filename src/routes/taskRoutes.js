const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middlewares/authMiddleware');
const {
  validateBody,
  validateParams,
  validateQuery,
} = require('../middlewares/validationMiddleware');
const {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
  taskIdParamSchema,
} = require('../validators/taskValidator');

/**
 * Task Routes
 */

// Statistics and special queries (must come before /:id routes)
router.get(
  '/statistics/summary',
  authenticate,
  taskController.getTaskStatistics
);

router.get(
  '/overdue/list',
  authenticate,
  taskController.getOverdueTasks
);

router.get(
  '/upcoming/list',
  authenticate,
  taskController.getUpcomingTasks
);

// CRUD routes
router.post(
  '/',
  authenticate,
  validateBody(createTaskSchema),
  taskController.createTask
);

router.get(
  '/',
  authenticate,
  validateQuery(taskQuerySchema),
  taskController.getTasks
);

router.get(
  '/:id',
  authenticate,
  validateParams(taskIdParamSchema),
  taskController.getTaskById
);

router.put(
  '/:id',
  authenticate,
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  taskController.updateTask
);

router.delete(
  '/:id',
  authenticate,
  validateParams(taskIdParamSchema),
  taskController.deleteTask
);

module.exports = router;
