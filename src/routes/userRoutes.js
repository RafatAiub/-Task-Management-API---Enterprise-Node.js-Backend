const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validateBody } = require('../middlewares/validationMiddleware');
const {
  updateProfileSchema,
  changePasswordSchema,
} = require('../validators/userValidator');

/**
 * User Routes
 */

// User profile routes
router.get('/profile', authenticate, userController.getProfile);

router.put(
  '/profile',
  authenticate,
  validateBody(updateProfileSchema),
  userController.updateProfile
);

router.put(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  userController.changePassword
);

router.delete('/account', authenticate, userController.deactivateAccount);

// Admin routes
router.get('/', authenticate, isAdmin, userController.getAllUsers);

router.get(
  '/statistics',
  authenticate,
  isAdmin,
  userController.getUserStatistics
);

module.exports = router;
