/**
 * Helper Utility Functions
 * Collection of reusable helper functions
 */

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean}
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Sanitize object by removing undefined/null values
 * @param {Object} obj - Object to sanitize
 * @returns {Object}
 */
const sanitizeObject = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string}
 */
const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string}
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Calculate pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object}
 */
const calculatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object}
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string}
 */
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

module.exports = {
  isEmpty,
  sanitizeObject,
  generateRandomString,
  formatDate,
  calculatePagination,
  sleep,
  deepClone,
  capitalize,
};
