/**
 * Test Setup File
 * Runs before all tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret-key';
process.env.MONGODB_TEST_URI = 'mongodb://localhost:27017/task_management_test_db';

// Global test timeout
jest.setTimeout(10000);

// Mock logger to reduce console noise during tests
jest.mock('../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  http: jest.fn(),
}));
