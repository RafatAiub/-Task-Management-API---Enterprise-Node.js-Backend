const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');
const { validateBody } = require('../middlewares/validationMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../validators/authValidator');

/**
 * Authentication Routes
 */

// Public routes with rate limiting
router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  authController.register
);

router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  authController.login
);

router.post(
  '/refresh-token',
  validateBody(refreshTokenSchema),
  authController.refreshToken
);

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
