// Create a mock DB module for tests
const mockDB = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
};

jest.mock('../../db.js', () => ({
  __esModule: true,
  default: mockDB,
  verifyDatabaseConnection: jest.fn().mockResolvedValue(true)
}));

module.exports = mockDB;
