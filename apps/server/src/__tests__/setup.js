// Jest setup file

// Mock TextEncoder/TextDecoder
const util = require('util');
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;

// Set up global mocks if needed
global.prismaMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

// This file is only for setup, to prevent Jest from treating it as a test
// Add a dummy test to satisfy Jest
test.skip('Setup file - not a test', () => {
  expect(true).toBe(true);
});

// Setup test environment
const mockDB = require('./mocks/db');

// Mock the db.js module using manual mock
jest.mock('../db.js', () => mockDB);

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// No tests here - just setup
