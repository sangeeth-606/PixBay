const { mockDeep, mockReset } = require('jest-mock-extended');

// Create the mock with a prefix that Jest allows
const mockPrisma = mockDeep();

jest.mock('../../db.js', () => {
  return {
    __esModule: true,
    default: mockPrisma,
    verifyDatabaseConnection: jest.fn().mockResolvedValue(true)
  };
});

beforeEach(() => {
  mockReset(mockPrisma);
});

module.exports = mockPrisma;
