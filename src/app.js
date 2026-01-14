const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const logger = require('./config/logger');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');
const { apiLimiter } = require('./middlewares/rateLimitMiddleware');

/**
 * Express Application Setup
 * Configures middleware and routes
 */
const app = express();

// Security middleware
app.use(helmet()); // Set security HTTP headers

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
  });
}

// Rate limiting
app.use('/api', apiLimiter);

// API routes
app.use(`/api/${process.env.API_VERSION || 'v1'}`, routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Management API',
    version: process.env.API_VERSION || 'v1',
    documentation: '/api/v1/health',
  });
});

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
