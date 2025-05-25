import { mockDeep, mockReset } from 'jest-mock-extended';

// Create a mock PrismaClient with all nested objects
const mockDB = mockDeep();

// Reset mock between tests
beforeEach(() => {
  mockReset(mockDB);
});

export default mockDB;
