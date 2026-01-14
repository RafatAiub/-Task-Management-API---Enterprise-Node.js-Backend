/**
 * Custom API Error Class
 * Extends the built-in Error class for consistent error handling
 */
class ApiError extends Error {
  /**
   * Create an API Error
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {string} details - Additional error details
   * @param {boolean} isOperational - Whether error is operational (expected)
   */
  constructor(
    statusCode,
    message,
    details = '',
    isOperational = true
  ) {
    super(message);
    
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON format
   * @returns {Object}
   */
  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };
  }
}

module.exports = ApiError;
