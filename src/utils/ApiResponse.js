/**
 * Standard API Response Class
 * Provides consistent response format across the application
 */
class ApiResponse {
  /**
   * Create a success response
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {Object} meta - Additional metadata (pagination, etc.)
   */
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    
    if (meta) {
      this.meta = meta;
    }
    
    this.timestamp = new Date().toISOString();
  }

  /**
   * Create a success response with data
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   * @returns {ApiResponse}
   */
  static success(data, message = 'Success', statusCode = 200) {
    return new ApiResponse(statusCode, data, message);
  }

  /**
   * Create a success response with pagination
   * @param {*} data - Response data
   * @param {Object} pagination - Pagination info
   * @param {string} message - Success message
   * @returns {ApiResponse}
   */
  static successWithPagination(data, pagination, message = 'Success') {
    return new ApiResponse(200, data, message, { pagination });
  }

  /**
   * Create a created response (201)
   * @param {*} data - Created resource data
   * @param {string} message - Success message
   * @returns {ApiResponse}
   */
  static created(data, message = 'Resource created successfully') {
    return new ApiResponse(201, data, message);
  }

  /**
   * Create a no content response (204)
   * @param {string} message - Success message
   * @returns {ApiResponse}
   */
  static noContent(message = 'No content') {
    return new ApiResponse(204, null, message);
  }
}

module.exports = ApiResponse;
